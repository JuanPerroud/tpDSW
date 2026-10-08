import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RoutineCard from "./RoutineCard";

const routine = {
  id: 7,
  name: "Pecho y tríceps",
  description: "Rutina de fuerza",
  RoutineExercises: [
    {
      exerciseId: 2,
      orderIndex: 2,
      restSeconds: 60,
      Exercise: { id: 2, name: "Fondos", muscleGroup: "triceps" },
      ExerciseSets: [{ setNumber: 1, reps: 12, weightKg: null }],
    },
    {
      exerciseId: 1,
      orderIndex: 1,
      restSeconds: 90,
      Exercise: { id: 1, name: "Press banca", muscleGroup: "pecho" },
      ExerciseSets: [
        { setNumber: 1, reps: 10, weightKg: 60 },
        { setNumber: 2, reps: 8, weightKg: 65 },
      ],
    },
  ],
};

describe("RoutineCard", () => {
  it("muestra el nombre, la descripción y el badge 'Mi Rutina'", () => {
    render(<RoutineCard routine={routine} isMine />);

    expect(screen.getByRole("heading", { name: "Pecho y tríceps" })).toBeInTheDocument();
    expect(screen.getByText("Rutina de fuerza")).toBeInTheDocument();
    expect(screen.getByText("Mi Rutina")).toBeInTheDocument();
    expect(screen.queryByText("Detalle de ejercicios")).not.toBeInTheDocument();
  });

  it("expande el detalle con ejercicios ordenados por orderIndex, series y peso", async () => {
    const user = userEvent.setup();
    render(<RoutineCard routine={routine} isMine />);

    await user.click(screen.getByRole("button", { name: /Ver detalle/ }));

    expect(screen.getByText("Detalle de ejercicios")).toBeInTheDocument();
    const names = screen
      .getAllByText(/^(Press banca|Fondos)$/)
      .map((el) => el.textContent);
    expect(names).toEqual(["Press banca", "Fondos"]);
    expect(screen.getByText("10 reps")).toBeInTheDocument();
    expect(screen.getByText("@ 65 kg")).toBeInTheDocument();
    expect(screen.getByText("Pecho")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Ocultar detalle/ }));
    expect(screen.queryByText("Detalle de ejercicios")).not.toBeInTheDocument();
  });

  it("en una rutina propia llama a onUpdate y onDelete con los datos correctos", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    render(<RoutineCard routine={routine} isMine onUpdate={onUpdate} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /Editar/ }));
    await user.click(screen.getByRole("button", { name: /Eliminar/ }));

    expect(onUpdate).toHaveBeenCalledWith(routine);
    expect(onDelete).toHaveBeenCalledWith(7);
    expect(screen.queryByRole("button", { name: /Guardar en Mis Rutinas/ })).not.toBeInTheDocument();
  });

  it("en una rutina de la comunidad muestra 'Guardar' y oculta editar/eliminar", async () => {
    const user = userEvent.setup();
    const onSaveToMine = vi.fn();
    render(<RoutineCard routine={routine} isMine={false} onSaveToMine={onSaveToMine} />);

    expect(screen.getByText("Comunidad")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Editar/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Eliminar/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Guardar en Mis Rutinas/ }));
    expect(onSaveToMine).toHaveBeenCalledWith(routine);
  });

  it("muestra un mensaje si la rutina no tiene ejercicios", async () => {
    const user = userEvent.setup();
    render(<RoutineCard routine={{ id: 1, name: "Vacía", RoutineExercises: [] }} />);

    await user.click(screen.getByRole("button", { name: /Ver detalle/ }));

    expect(screen.getByText("Esta rutina no tiene ejercicios asignados.")).toBeInTheDocument();
  });
});
