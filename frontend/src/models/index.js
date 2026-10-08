/**
 * Modelos de datos del frontend (reflejan las respuestas de la API del backend).
 * Cada clase expone `fromApi(json)` para construir instancias desde una respuesta HTTP.
 */

export class User {
  /**
   * @param {{id:number,name:string,surname:string,age?:number,email:string,isAdmin?:boolean,status?:boolean}} data
   */
  constructor({ id, name, surname, age, email, isAdmin = false, status = true, ...rest }) {
    Object.assign(this, rest);
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.email = email;
    this.isAdmin = isAdmin;
    this.status = status;
  }

  get fullName() {
    return `${this.name} ${this.surname ?? ""}`.trim();
  }

  static fromApi(json) {
    return json ? new User(json) : null;
  }
}

export class Exercise {
  /**
   * @param {{id?:number,name:string,description?:string,muscleGroup:string,isPublic?:boolean,creatorId?:number|null}} data
   */
  constructor({ id, name, description, muscleGroup, isPublic = true, creatorId = null, ...rest }) {
    Object.assign(this, rest);
    this.id = id;
    this.name = name;
    this.description = description;
    this.muscleGroup = muscleGroup;
    this.isPublic = isPublic;
    this.creatorId = creatorId;
  }

  static fromApi(json) {
    return new Exercise(json);
  }
}

export class ExerciseSet {
  /** @param {{id?:number,setNumber:number,reps:number,weightKg?:number|string|null}} data */
  constructor({ id, setNumber, reps, weightKg = null, ...rest }) {
    Object.assign(this, rest);
    this.id = id;
    this.setNumber = setNumber;
    this.reps = reps;
    this.weightKg = weightKg;
  }

  static fromApi(json) {
    return new ExerciseSet(json);
  }
}

export class RoutineExercise {
  /**
   * @param {{id?:number,exerciseId:number,orderIndex?:number,restSeconds?:number,Exercise?:object,ExerciseSets?:object[]}} data
   */
  constructor({ id, exerciseId, orderIndex = 1, restSeconds = 90, Exercise: exercise, ExerciseSets = [], ...rest }) {
    Object.assign(this, rest);
    this.id = id;
    this.exerciseId = exerciseId;
    this.orderIndex = orderIndex;
    this.restSeconds = restSeconds;
    this.Exercise = exercise ? Exercise.fromApi(exercise) : undefined;
    this.ExerciseSets = ExerciseSets.map(ExerciseSet.fromApi);
  }

  static fromApi(json) {
    return new RoutineExercise(json);
  }
}

export class Routine {
  /**
   * @param {{id?:number,name:string,description?:string,creatorId?:number,creator?:object,RoutineExercises?:object[]}} data
   */
  constructor({ id, name, description, creatorId, creator, RoutineExercises = [], ...rest }) {
    Object.assign(this, rest);
    this.id = id;
    this.name = name;
    this.description = description;
    this.creatorId = creatorId;
    this.creator = creator;
    this.RoutineExercises = RoutineExercises.map(RoutineExercise.fromApi);
  }

  static fromApi(json) {
    return new Routine(json);
  }
}
