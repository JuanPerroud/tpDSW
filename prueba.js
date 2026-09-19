async function probarIA() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/ai/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sport: "gym",
                goal: "Hipertrofia",
                level: "intermedio"
            })
        });

        const datos = await respuesta.json();
        console.log("=== RUTINA GENERADA ===");
        console.log(datos.generatedRoutine);
    } catch (error) {
        console.error("Error en la prueba:", error);
    }
}

probarIA();
//Este archvo esta solo para probar que funcionaba a ia, desp se borra