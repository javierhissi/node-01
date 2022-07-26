// type interfaces

type PersonaType = {
  nombre: string;
  apellido: string;
  edad: number;
  saluda: () => void;
};
type PerroType = {
  nombre: string;
  edad: number;
  saluda: () => void;
};

interface PType {
  nombre: string;
  apellido: string;
}

interface PEType extends PType {
  edad: number;
}

interface PESType extends PEType {
  saluda: () => void;
}

let nombre = () => {
  let persona: PESType = {
    nombre: "hola",
    apellido: "vega",
    edad: 10,
    saluda: () => {
      console.log("hola");
    },
  };

  let perro: PerroType = persona;

  Object.keys(perro).forEach((p) => {
    console.log(p);
  });
};

const varios = () => {
  const v = (nn: string | undefined) => {
    // null undefined false 0 '' -> valores falsy
    if (nn) {
      nn.charAt(0);
    }
  };
  v("1");

  type NPType = {
    nombre: string;
    apellido: string;
    edad: number;
    sexo: boolean;
    altura: number;
    religion: string;
  };

  type CrearPersonaType = (
    nombre: string,
    apellido: string,
    edad: number,
    sexo: boolean,
    altura: number,
    religion: string
  ) => NPType;

  const crearPersona: CrearPersonaType = (
    nombre,
    apellido,
    edad,
    sexo,
    altura,
    religion
  ) => {
    return { nombre, apellido, edad, sexo, altura, religion };
  };

  type CreatePerson2Type = {
    nombre: string;
    apellido: string;
    edad: number;
    sexo: boolean;
    altura: number;
    religion: string;
  };

  const crearPersona2 = (persona: CreatePerson2Type) => {
    return {
      nombre: persona.nombre,
      apellido: persona.apellido,
      edad: persona.edad,
      sexo: persona.sexo,
      altura: persona.altura,
      religion: persona.religion,
    };
  };

  console.log(
    "crear-persona",
    crearPersona("vega", "javier", 167, true, 35, "nada")
  );

  console.log(
    "crear-persona-2",
    crearPersona2({
      nombre: "javier",
      apellido: "vega",
      edad: 35,
      sexo: true,
      altura: 167,
      religion: "nada",
    })
  );
};

export default () => {
  nombre();
  varios();
};
