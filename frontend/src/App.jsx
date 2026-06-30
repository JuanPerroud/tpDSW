import { Card, CardBody } from "./components/Card";

const App = () => {
  return (
    <div>
      <h1>GYM routines</h1>
      <p>Mi primera pagina</p>

      <Card>
        <CardBody
          title="Hola mundo"
          text="Este es un ejemplo de texto para la tarjeta."
        />
      </Card>
    </div>
  );
};

export default App;
