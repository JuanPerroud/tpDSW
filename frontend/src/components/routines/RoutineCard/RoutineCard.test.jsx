import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RoutineCard from "./RoutineCard";
import routineService from "../../../services/routineService";

vi.mock("../../../services/routineService", () => ({
  default: { getById: vi.fn() },
}));

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

// Respuesta de GET /api/routine/:id: la rutina más el creador
const routineDetail = { ...routine, creator: { id: 5, name: "Ana", surname: "Pérez" } };

describe("RoutineCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routineService.getById.mockResolvedValue(routineDetail);
  });

  it("muestra el nombre, la descripción y el badge 'Mi Rutina'", () => {
    render(<RoutineCard routine={routine} isMine />);

    expect(screen.getByRole("heading", { name: "Pecho y tríceps" })).toBeInTheDocument();
    expect(screen.getByText("Rutina de fuerza")).toBeInTheDocument();
    expect(screen.getByText("Mi Rutina")).toBeInTheDocument();
    expect(screen.queryByText("Detalle de ejercicios")).not.toBeInTheDocument();
    expect(routineService.getById).not.toHaveBeenCalled();
  });

  it("al expandir pide el detalle al backend y muestra ejercicios ordenados, series, peso y creador", async () => {
    const user = userEvent.setup();
    render(<RoutineCard routine={routine} isMine />);

    await user.click(screen.getByRole("button", { name: /Ver detalle/ }));

    expect(routineService.getById).toHaveBeenCalledWith(7);
    expect(await screen.findByText("Creada por Ana Pérez")).toBeInTheDocument();
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

  it("solo pide el detalle una vez aunque se expanda varias veces", async () => {
    const user = userEvent.setup();
    render(<RoutineCard routine={routine} isMine />);

    await user.click(screen.getByRole("button", { name: /Ver detalle/ }));
    await screen.findByText("Creada por Ana Pérez");
    await user.click(screen.getByRole("button", { name: /Ocultar detalle/ }));
    await user.click(screen.getByRole("button", { name: /Ver detalle/ }));

    expect(routineService.getById).toHaveBeenCalledTimes(1);
  });

  it("si falla la request avisa al usuario y muestra los datos que ya tenía", async () => {
    routineService.getById.mockRejectedValue(new Error("Network Error"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<RoutineCard routine={routine} isMine />);

    await user.click(screen.getByRole("button", { name: /Ver detalle/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/No se pudo actualizar el detalle/);
    expect(screen.getByText("Press banca")).toBeInTheDocument();
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
    routineService.getById.mockResolvedValue({ id: 1, name: "Vacía", RoutineExercises: [] });
    const user = userEvent.setup();
    render(<RoutineCard routine={{ id: 1, name: "Vacía", RoutineExercises: [] }} />);

    await user.click(screen.getByRole("button", { name: /Ver detalle/ }));

    expect(await screen.findByText("Esta rutina no tiene ejercicios asignados.")).toBeInTheDocument();
  });
});
