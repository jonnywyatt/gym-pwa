
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model BodyArea
 * 
 */
export type BodyArea = $Result.DefaultSelection<Prisma.$BodyAreaPayload>
/**
 * Model MuscleGroup
 * 
 */
export type MuscleGroup = $Result.DefaultSelection<Prisma.$MuscleGroupPayload>
/**
 * Model Exercise
 * 
 */
export type Exercise = $Result.DefaultSelection<Prisma.$ExercisePayload>
/**
 * Model ExercisePrimaryMuscleGroup
 * 
 */
export type ExercisePrimaryMuscleGroup = $Result.DefaultSelection<Prisma.$ExercisePrimaryMuscleGroupPayload>
/**
 * Model ExerciseSecondaryMuscleGroup
 * 
 */
export type ExerciseSecondaryMuscleGroup = $Result.DefaultSelection<Prisma.$ExerciseSecondaryMuscleGroupPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const RecordSetsType: {
  WEIGHT: 'WEIGHT',
  BODYWEIGHT_MINUS_OFFSET: 'BODYWEIGHT_MINUS_OFFSET',
  TIME: 'TIME',
  WEIGHT_AND_TIME: 'WEIGHT_AND_TIME',
  BODYWEIGHT_PLUS_WEIGHT: 'BODYWEIGHT_PLUS_WEIGHT'
};

export type RecordSetsType = (typeof RecordSetsType)[keyof typeof RecordSetsType]


export const BodyAreaLabel: {
  CHEST: 'CHEST',
  BACK: 'BACK',
  SHOULDERS: 'SHOULDERS',
  ARMS: 'ARMS',
  CORE: 'CORE',
  LEGS: 'LEGS'
};

export type BodyAreaLabel = (typeof BodyAreaLabel)[keyof typeof BodyAreaLabel]


export const MuscleGroupLabel: {
  PECTORALIS_MAJOR: 'PECTORALIS_MAJOR',
  PECTORALIS_MINOR: 'PECTORALIS_MINOR',
  LATISSIMUS_DORSI: 'LATISSIMUS_DORSI',
  TRAPEZIUS: 'TRAPEZIUS',
  RHOMBOIDS: 'RHOMBOIDS',
  LOWER_BACK: 'LOWER_BACK',
  REAR_DELTOIDS: 'REAR_DELTOIDS',
  FRONT_DELTOIDS: 'FRONT_DELTOIDS',
  BICEPS: 'BICEPS',
  TRICEPS: 'TRICEPS',
  FOREARMS: 'FOREARMS',
  ABDOMINALS: 'ABDOMINALS',
  OBLIQUES: 'OBLIQUES',
  GLUTES: 'GLUTES',
  HAMSTRINGS: 'HAMSTRINGS',
  QUADRICEPS: 'QUADRICEPS',
  ADDUCTORS: 'ADDUCTORS',
  CALVES: 'CALVES'
};

export type MuscleGroupLabel = (typeof MuscleGroupLabel)[keyof typeof MuscleGroupLabel]

}

export type RecordSetsType = $Enums.RecordSetsType

export const RecordSetsType: typeof $Enums.RecordSetsType

export type BodyAreaLabel = $Enums.BodyAreaLabel

export const BodyAreaLabel: typeof $Enums.BodyAreaLabel

export type MuscleGroupLabel = $Enums.MuscleGroupLabel

export const MuscleGroupLabel: typeof $Enums.MuscleGroupLabel

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more BodyAreas
 * const bodyAreas = await prisma.bodyArea.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more BodyAreas
   * const bodyAreas = await prisma.bodyArea.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.bodyArea`: Exposes CRUD operations for the **BodyArea** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BodyAreas
    * const bodyAreas = await prisma.bodyArea.findMany()
    * ```
    */
  get bodyArea(): Prisma.BodyAreaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.muscleGroup`: Exposes CRUD operations for the **MuscleGroup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MuscleGroups
    * const muscleGroups = await prisma.muscleGroup.findMany()
    * ```
    */
  get muscleGroup(): Prisma.MuscleGroupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exercise`: Exposes CRUD operations for the **Exercise** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Exercises
    * const exercises = await prisma.exercise.findMany()
    * ```
    */
  get exercise(): Prisma.ExerciseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exercisePrimaryMuscleGroup`: Exposes CRUD operations for the **ExercisePrimaryMuscleGroup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExercisePrimaryMuscleGroups
    * const exercisePrimaryMuscleGroups = await prisma.exercisePrimaryMuscleGroup.findMany()
    * ```
    */
  get exercisePrimaryMuscleGroup(): Prisma.ExercisePrimaryMuscleGroupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exerciseSecondaryMuscleGroup`: Exposes CRUD operations for the **ExerciseSecondaryMuscleGroup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExerciseSecondaryMuscleGroups
    * const exerciseSecondaryMuscleGroups = await prisma.exerciseSecondaryMuscleGroup.findMany()
    * ```
    */
  get exerciseSecondaryMuscleGroup(): Prisma.ExerciseSecondaryMuscleGroupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    BodyArea: 'BodyArea',
    MuscleGroup: 'MuscleGroup',
    Exercise: 'Exercise',
    ExercisePrimaryMuscleGroup: 'ExercisePrimaryMuscleGroup',
    ExerciseSecondaryMuscleGroup: 'ExerciseSecondaryMuscleGroup',
    User: 'User'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "bodyArea" | "muscleGroup" | "exercise" | "exercisePrimaryMuscleGroup" | "exerciseSecondaryMuscleGroup" | "user"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      BodyArea: {
        payload: Prisma.$BodyAreaPayload<ExtArgs>
        fields: Prisma.BodyAreaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BodyAreaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BodyAreaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload>
          }
          findFirst: {
            args: Prisma.BodyAreaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BodyAreaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload>
          }
          findMany: {
            args: Prisma.BodyAreaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload>[]
          }
          create: {
            args: Prisma.BodyAreaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload>
          }
          createMany: {
            args: Prisma.BodyAreaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BodyAreaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload>[]
          }
          delete: {
            args: Prisma.BodyAreaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload>
          }
          update: {
            args: Prisma.BodyAreaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload>
          }
          deleteMany: {
            args: Prisma.BodyAreaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BodyAreaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BodyAreaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload>[]
          }
          upsert: {
            args: Prisma.BodyAreaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BodyAreaPayload>
          }
          aggregate: {
            args: Prisma.BodyAreaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBodyArea>
          }
          groupBy: {
            args: Prisma.BodyAreaGroupByArgs<ExtArgs>
            result: $Utils.Optional<BodyAreaGroupByOutputType>[]
          }
          count: {
            args: Prisma.BodyAreaCountArgs<ExtArgs>
            result: $Utils.Optional<BodyAreaCountAggregateOutputType> | number
          }
        }
      }
      MuscleGroup: {
        payload: Prisma.$MuscleGroupPayload<ExtArgs>
        fields: Prisma.MuscleGroupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MuscleGroupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MuscleGroupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload>
          }
          findFirst: {
            args: Prisma.MuscleGroupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MuscleGroupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload>
          }
          findMany: {
            args: Prisma.MuscleGroupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload>[]
          }
          create: {
            args: Prisma.MuscleGroupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload>
          }
          createMany: {
            args: Prisma.MuscleGroupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MuscleGroupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload>[]
          }
          delete: {
            args: Prisma.MuscleGroupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload>
          }
          update: {
            args: Prisma.MuscleGroupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload>
          }
          deleteMany: {
            args: Prisma.MuscleGroupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MuscleGroupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MuscleGroupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload>[]
          }
          upsert: {
            args: Prisma.MuscleGroupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MuscleGroupPayload>
          }
          aggregate: {
            args: Prisma.MuscleGroupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMuscleGroup>
          }
          groupBy: {
            args: Prisma.MuscleGroupGroupByArgs<ExtArgs>
            result: $Utils.Optional<MuscleGroupGroupByOutputType>[]
          }
          count: {
            args: Prisma.MuscleGroupCountArgs<ExtArgs>
            result: $Utils.Optional<MuscleGroupCountAggregateOutputType> | number
          }
        }
      }
      Exercise: {
        payload: Prisma.$ExercisePayload<ExtArgs>
        fields: Prisma.ExerciseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExerciseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExerciseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          findFirst: {
            args: Prisma.ExerciseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExerciseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          findMany: {
            args: Prisma.ExerciseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>[]
          }
          create: {
            args: Prisma.ExerciseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          createMany: {
            args: Prisma.ExerciseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExerciseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>[]
          }
          delete: {
            args: Prisma.ExerciseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          update: {
            args: Prisma.ExerciseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          deleteMany: {
            args: Prisma.ExerciseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExerciseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExerciseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>[]
          }
          upsert: {
            args: Prisma.ExerciseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          aggregate: {
            args: Prisma.ExerciseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExercise>
          }
          groupBy: {
            args: Prisma.ExerciseGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExerciseGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExerciseCountArgs<ExtArgs>
            result: $Utils.Optional<ExerciseCountAggregateOutputType> | number
          }
        }
      }
      ExercisePrimaryMuscleGroup: {
        payload: Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>
        fields: Prisma.ExercisePrimaryMuscleGroupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExercisePrimaryMuscleGroupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExercisePrimaryMuscleGroupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload>
          }
          findFirst: {
            args: Prisma.ExercisePrimaryMuscleGroupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExercisePrimaryMuscleGroupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload>
          }
          findMany: {
            args: Prisma.ExercisePrimaryMuscleGroupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload>[]
          }
          create: {
            args: Prisma.ExercisePrimaryMuscleGroupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload>
          }
          createMany: {
            args: Prisma.ExercisePrimaryMuscleGroupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExercisePrimaryMuscleGroupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload>[]
          }
          delete: {
            args: Prisma.ExercisePrimaryMuscleGroupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload>
          }
          update: {
            args: Prisma.ExercisePrimaryMuscleGroupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload>
          }
          deleteMany: {
            args: Prisma.ExercisePrimaryMuscleGroupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExercisePrimaryMuscleGroupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExercisePrimaryMuscleGroupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload>[]
          }
          upsert: {
            args: Prisma.ExercisePrimaryMuscleGroupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePrimaryMuscleGroupPayload>
          }
          aggregate: {
            args: Prisma.ExercisePrimaryMuscleGroupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExercisePrimaryMuscleGroup>
          }
          groupBy: {
            args: Prisma.ExercisePrimaryMuscleGroupGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExercisePrimaryMuscleGroupGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExercisePrimaryMuscleGroupCountArgs<ExtArgs>
            result: $Utils.Optional<ExercisePrimaryMuscleGroupCountAggregateOutputType> | number
          }
        }
      }
      ExerciseSecondaryMuscleGroup: {
        payload: Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>
        fields: Prisma.ExerciseSecondaryMuscleGroupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExerciseSecondaryMuscleGroupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExerciseSecondaryMuscleGroupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload>
          }
          findFirst: {
            args: Prisma.ExerciseSecondaryMuscleGroupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExerciseSecondaryMuscleGroupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload>
          }
          findMany: {
            args: Prisma.ExerciseSecondaryMuscleGroupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload>[]
          }
          create: {
            args: Prisma.ExerciseSecondaryMuscleGroupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload>
          }
          createMany: {
            args: Prisma.ExerciseSecondaryMuscleGroupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExerciseSecondaryMuscleGroupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload>[]
          }
          delete: {
            args: Prisma.ExerciseSecondaryMuscleGroupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload>
          }
          update: {
            args: Prisma.ExerciseSecondaryMuscleGroupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload>
          }
          deleteMany: {
            args: Prisma.ExerciseSecondaryMuscleGroupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExerciseSecondaryMuscleGroupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExerciseSecondaryMuscleGroupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload>[]
          }
          upsert: {
            args: Prisma.ExerciseSecondaryMuscleGroupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseSecondaryMuscleGroupPayload>
          }
          aggregate: {
            args: Prisma.ExerciseSecondaryMuscleGroupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExerciseSecondaryMuscleGroup>
          }
          groupBy: {
            args: Prisma.ExerciseSecondaryMuscleGroupGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExerciseSecondaryMuscleGroupGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExerciseSecondaryMuscleGroupCountArgs<ExtArgs>
            result: $Utils.Optional<ExerciseSecondaryMuscleGroupCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    bodyArea?: BodyAreaOmit
    muscleGroup?: MuscleGroupOmit
    exercise?: ExerciseOmit
    exercisePrimaryMuscleGroup?: ExercisePrimaryMuscleGroupOmit
    exerciseSecondaryMuscleGroup?: ExerciseSecondaryMuscleGroupOmit
    user?: UserOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type BodyAreaCountOutputType
   */

  export type BodyAreaCountOutputType = {
    muscleGroups: number
  }

  export type BodyAreaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    muscleGroups?: boolean | BodyAreaCountOutputTypeCountMuscleGroupsArgs
  }

  // Custom InputTypes
  /**
   * BodyAreaCountOutputType without action
   */
  export type BodyAreaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyAreaCountOutputType
     */
    select?: BodyAreaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BodyAreaCountOutputType without action
   */
  export type BodyAreaCountOutputTypeCountMuscleGroupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MuscleGroupWhereInput
  }


  /**
   * Count Type MuscleGroupCountOutputType
   */

  export type MuscleGroupCountOutputType = {
    primaryExercises: number
    secondaryExercises: number
  }

  export type MuscleGroupCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    primaryExercises?: boolean | MuscleGroupCountOutputTypeCountPrimaryExercisesArgs
    secondaryExercises?: boolean | MuscleGroupCountOutputTypeCountSecondaryExercisesArgs
  }

  // Custom InputTypes
  /**
   * MuscleGroupCountOutputType without action
   */
  export type MuscleGroupCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroupCountOutputType
     */
    select?: MuscleGroupCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MuscleGroupCountOutputType without action
   */
  export type MuscleGroupCountOutputTypeCountPrimaryExercisesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExercisePrimaryMuscleGroupWhereInput
  }

  /**
   * MuscleGroupCountOutputType without action
   */
  export type MuscleGroupCountOutputTypeCountSecondaryExercisesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseSecondaryMuscleGroupWhereInput
  }


  /**
   * Count Type ExerciseCountOutputType
   */

  export type ExerciseCountOutputType = {
    primaryMuscleGroups: number
    secondaryMuscleGroups: number
  }

  export type ExerciseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    primaryMuscleGroups?: boolean | ExerciseCountOutputTypeCountPrimaryMuscleGroupsArgs
    secondaryMuscleGroups?: boolean | ExerciseCountOutputTypeCountSecondaryMuscleGroupsArgs
  }

  // Custom InputTypes
  /**
   * ExerciseCountOutputType without action
   */
  export type ExerciseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseCountOutputType
     */
    select?: ExerciseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExerciseCountOutputType without action
   */
  export type ExerciseCountOutputTypeCountPrimaryMuscleGroupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExercisePrimaryMuscleGroupWhereInput
  }

  /**
   * ExerciseCountOutputType without action
   */
  export type ExerciseCountOutputTypeCountSecondaryMuscleGroupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseSecondaryMuscleGroupWhereInput
  }


  /**
   * Models
   */

  /**
   * Model BodyArea
   */

  export type AggregateBodyArea = {
    _count: BodyAreaCountAggregateOutputType | null
    _avg: BodyAreaAvgAggregateOutputType | null
    _sum: BodyAreaSumAggregateOutputType | null
    _min: BodyAreaMinAggregateOutputType | null
    _max: BodyAreaMaxAggregateOutputType | null
  }

  export type BodyAreaAvgAggregateOutputType = {
    id: number | null
  }

  export type BodyAreaSumAggregateOutputType = {
    id: number | null
  }

  export type BodyAreaMinAggregateOutputType = {
    id: number | null
    label: $Enums.BodyAreaLabel | null
  }

  export type BodyAreaMaxAggregateOutputType = {
    id: number | null
    label: $Enums.BodyAreaLabel | null
  }

  export type BodyAreaCountAggregateOutputType = {
    id: number
    label: number
    _all: number
  }


  export type BodyAreaAvgAggregateInputType = {
    id?: true
  }

  export type BodyAreaSumAggregateInputType = {
    id?: true
  }

  export type BodyAreaMinAggregateInputType = {
    id?: true
    label?: true
  }

  export type BodyAreaMaxAggregateInputType = {
    id?: true
    label?: true
  }

  export type BodyAreaCountAggregateInputType = {
    id?: true
    label?: true
    _all?: true
  }

  export type BodyAreaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BodyArea to aggregate.
     */
    where?: BodyAreaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BodyAreas to fetch.
     */
    orderBy?: BodyAreaOrderByWithRelationInput | BodyAreaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BodyAreaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BodyAreas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BodyAreas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BodyAreas
    **/
    _count?: true | BodyAreaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BodyAreaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BodyAreaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BodyAreaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BodyAreaMaxAggregateInputType
  }

  export type GetBodyAreaAggregateType<T extends BodyAreaAggregateArgs> = {
        [P in keyof T & keyof AggregateBodyArea]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBodyArea[P]>
      : GetScalarType<T[P], AggregateBodyArea[P]>
  }




  export type BodyAreaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BodyAreaWhereInput
    orderBy?: BodyAreaOrderByWithAggregationInput | BodyAreaOrderByWithAggregationInput[]
    by: BodyAreaScalarFieldEnum[] | BodyAreaScalarFieldEnum
    having?: BodyAreaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BodyAreaCountAggregateInputType | true
    _avg?: BodyAreaAvgAggregateInputType
    _sum?: BodyAreaSumAggregateInputType
    _min?: BodyAreaMinAggregateInputType
    _max?: BodyAreaMaxAggregateInputType
  }

  export type BodyAreaGroupByOutputType = {
    id: number
    label: $Enums.BodyAreaLabel
    _count: BodyAreaCountAggregateOutputType | null
    _avg: BodyAreaAvgAggregateOutputType | null
    _sum: BodyAreaSumAggregateOutputType | null
    _min: BodyAreaMinAggregateOutputType | null
    _max: BodyAreaMaxAggregateOutputType | null
  }

  type GetBodyAreaGroupByPayload<T extends BodyAreaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BodyAreaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BodyAreaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BodyAreaGroupByOutputType[P]>
            : GetScalarType<T[P], BodyAreaGroupByOutputType[P]>
        }
      >
    >


  export type BodyAreaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    muscleGroups?: boolean | BodyArea$muscleGroupsArgs<ExtArgs>
    _count?: boolean | BodyAreaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bodyArea"]>

  export type BodyAreaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
  }, ExtArgs["result"]["bodyArea"]>

  export type BodyAreaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
  }, ExtArgs["result"]["bodyArea"]>

  export type BodyAreaSelectScalar = {
    id?: boolean
    label?: boolean
  }

  export type BodyAreaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "label", ExtArgs["result"]["bodyArea"]>
  export type BodyAreaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    muscleGroups?: boolean | BodyArea$muscleGroupsArgs<ExtArgs>
    _count?: boolean | BodyAreaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BodyAreaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BodyAreaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BodyAreaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BodyArea"
    objects: {
      muscleGroups: Prisma.$MuscleGroupPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      label: $Enums.BodyAreaLabel
    }, ExtArgs["result"]["bodyArea"]>
    composites: {}
  }

  type BodyAreaGetPayload<S extends boolean | null | undefined | BodyAreaDefaultArgs> = $Result.GetResult<Prisma.$BodyAreaPayload, S>

  type BodyAreaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BodyAreaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BodyAreaCountAggregateInputType | true
    }

  export interface BodyAreaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BodyArea'], meta: { name: 'BodyArea' } }
    /**
     * Find zero or one BodyArea that matches the filter.
     * @param {BodyAreaFindUniqueArgs} args - Arguments to find a BodyArea
     * @example
     * // Get one BodyArea
     * const bodyArea = await prisma.bodyArea.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BodyAreaFindUniqueArgs>(args: SelectSubset<T, BodyAreaFindUniqueArgs<ExtArgs>>): Prisma__BodyAreaClient<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BodyArea that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BodyAreaFindUniqueOrThrowArgs} args - Arguments to find a BodyArea
     * @example
     * // Get one BodyArea
     * const bodyArea = await prisma.bodyArea.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BodyAreaFindUniqueOrThrowArgs>(args: SelectSubset<T, BodyAreaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BodyAreaClient<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BodyArea that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BodyAreaFindFirstArgs} args - Arguments to find a BodyArea
     * @example
     * // Get one BodyArea
     * const bodyArea = await prisma.bodyArea.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BodyAreaFindFirstArgs>(args?: SelectSubset<T, BodyAreaFindFirstArgs<ExtArgs>>): Prisma__BodyAreaClient<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BodyArea that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BodyAreaFindFirstOrThrowArgs} args - Arguments to find a BodyArea
     * @example
     * // Get one BodyArea
     * const bodyArea = await prisma.bodyArea.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BodyAreaFindFirstOrThrowArgs>(args?: SelectSubset<T, BodyAreaFindFirstOrThrowArgs<ExtArgs>>): Prisma__BodyAreaClient<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BodyAreas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BodyAreaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BodyAreas
     * const bodyAreas = await prisma.bodyArea.findMany()
     * 
     * // Get first 10 BodyAreas
     * const bodyAreas = await prisma.bodyArea.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bodyAreaWithIdOnly = await prisma.bodyArea.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BodyAreaFindManyArgs>(args?: SelectSubset<T, BodyAreaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BodyArea.
     * @param {BodyAreaCreateArgs} args - Arguments to create a BodyArea.
     * @example
     * // Create one BodyArea
     * const BodyArea = await prisma.bodyArea.create({
     *   data: {
     *     // ... data to create a BodyArea
     *   }
     * })
     * 
     */
    create<T extends BodyAreaCreateArgs>(args: SelectSubset<T, BodyAreaCreateArgs<ExtArgs>>): Prisma__BodyAreaClient<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BodyAreas.
     * @param {BodyAreaCreateManyArgs} args - Arguments to create many BodyAreas.
     * @example
     * // Create many BodyAreas
     * const bodyArea = await prisma.bodyArea.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BodyAreaCreateManyArgs>(args?: SelectSubset<T, BodyAreaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BodyAreas and returns the data saved in the database.
     * @param {BodyAreaCreateManyAndReturnArgs} args - Arguments to create many BodyAreas.
     * @example
     * // Create many BodyAreas
     * const bodyArea = await prisma.bodyArea.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BodyAreas and only return the `id`
     * const bodyAreaWithIdOnly = await prisma.bodyArea.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BodyAreaCreateManyAndReturnArgs>(args?: SelectSubset<T, BodyAreaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BodyArea.
     * @param {BodyAreaDeleteArgs} args - Arguments to delete one BodyArea.
     * @example
     * // Delete one BodyArea
     * const BodyArea = await prisma.bodyArea.delete({
     *   where: {
     *     // ... filter to delete one BodyArea
     *   }
     * })
     * 
     */
    delete<T extends BodyAreaDeleteArgs>(args: SelectSubset<T, BodyAreaDeleteArgs<ExtArgs>>): Prisma__BodyAreaClient<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BodyArea.
     * @param {BodyAreaUpdateArgs} args - Arguments to update one BodyArea.
     * @example
     * // Update one BodyArea
     * const bodyArea = await prisma.bodyArea.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BodyAreaUpdateArgs>(args: SelectSubset<T, BodyAreaUpdateArgs<ExtArgs>>): Prisma__BodyAreaClient<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BodyAreas.
     * @param {BodyAreaDeleteManyArgs} args - Arguments to filter BodyAreas to delete.
     * @example
     * // Delete a few BodyAreas
     * const { count } = await prisma.bodyArea.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BodyAreaDeleteManyArgs>(args?: SelectSubset<T, BodyAreaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BodyAreas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BodyAreaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BodyAreas
     * const bodyArea = await prisma.bodyArea.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BodyAreaUpdateManyArgs>(args: SelectSubset<T, BodyAreaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BodyAreas and returns the data updated in the database.
     * @param {BodyAreaUpdateManyAndReturnArgs} args - Arguments to update many BodyAreas.
     * @example
     * // Update many BodyAreas
     * const bodyArea = await prisma.bodyArea.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BodyAreas and only return the `id`
     * const bodyAreaWithIdOnly = await prisma.bodyArea.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BodyAreaUpdateManyAndReturnArgs>(args: SelectSubset<T, BodyAreaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BodyArea.
     * @param {BodyAreaUpsertArgs} args - Arguments to update or create a BodyArea.
     * @example
     * // Update or create a BodyArea
     * const bodyArea = await prisma.bodyArea.upsert({
     *   create: {
     *     // ... data to create a BodyArea
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BodyArea we want to update
     *   }
     * })
     */
    upsert<T extends BodyAreaUpsertArgs>(args: SelectSubset<T, BodyAreaUpsertArgs<ExtArgs>>): Prisma__BodyAreaClient<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BodyAreas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BodyAreaCountArgs} args - Arguments to filter BodyAreas to count.
     * @example
     * // Count the number of BodyAreas
     * const count = await prisma.bodyArea.count({
     *   where: {
     *     // ... the filter for the BodyAreas we want to count
     *   }
     * })
    **/
    count<T extends BodyAreaCountArgs>(
      args?: Subset<T, BodyAreaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BodyAreaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BodyArea.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BodyAreaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BodyAreaAggregateArgs>(args: Subset<T, BodyAreaAggregateArgs>): Prisma.PrismaPromise<GetBodyAreaAggregateType<T>>

    /**
     * Group by BodyArea.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BodyAreaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BodyAreaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BodyAreaGroupByArgs['orderBy'] }
        : { orderBy?: BodyAreaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BodyAreaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBodyAreaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BodyArea model
   */
  readonly fields: BodyAreaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BodyArea.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BodyAreaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    muscleGroups<T extends BodyArea$muscleGroupsArgs<ExtArgs> = {}>(args?: Subset<T, BodyArea$muscleGroupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BodyArea model
   */
  interface BodyAreaFieldRefs {
    readonly id: FieldRef<"BodyArea", 'Int'>
    readonly label: FieldRef<"BodyArea", 'BodyAreaLabel'>
  }
    

  // Custom InputTypes
  /**
   * BodyArea findUnique
   */
  export type BodyAreaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BodyAreaInclude<ExtArgs> | null
    /**
     * Filter, which BodyArea to fetch.
     */
    where: BodyAreaWhereUniqueInput
  }

  /**
   * BodyArea findUniqueOrThrow
   */
  export type BodyAreaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BodyAreaInclude<ExtArgs> | null
    /**
     * Filter, which BodyArea to fetch.
     */
    where: BodyAreaWhereUniqueInput
  }

  /**
   * BodyArea findFirst
   */
  export type BodyAreaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BodyAreaInclude<ExtArgs> | null
    /**
     * Filter, which BodyArea to fetch.
     */
    where?: BodyAreaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BodyAreas to fetch.
     */
    orderBy?: BodyAreaOrderByWithRelationInput | BodyAreaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BodyAreas.
     */
    cursor?: BodyAreaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BodyAreas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BodyAreas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BodyAreas.
     */
    distinct?: BodyAreaScalarFieldEnum | BodyAreaScalarFieldEnum[]
  }

  /**
   * BodyArea findFirstOrThrow
   */
  export type BodyAreaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BodyAreaInclude<ExtArgs> | null
    /**
     * Filter, which BodyArea to fetch.
     */
    where?: BodyAreaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BodyAreas to fetch.
     */
    orderBy?: BodyAreaOrderByWithRelationInput | BodyAreaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BodyAreas.
     */
    cursor?: BodyAreaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BodyAreas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BodyAreas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BodyAreas.
     */
    distinct?: BodyAreaScalarFieldEnum | BodyAreaScalarFieldEnum[]
  }

  /**
   * BodyArea findMany
   */
  export type BodyAreaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BodyAreaInclude<ExtArgs> | null
    /**
     * Filter, which BodyAreas to fetch.
     */
    where?: BodyAreaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BodyAreas to fetch.
     */
    orderBy?: BodyAreaOrderByWithRelationInput | BodyAreaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BodyAreas.
     */
    cursor?: BodyAreaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BodyAreas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BodyAreas.
     */
    skip?: number
    distinct?: BodyAreaScalarFieldEnum | BodyAreaScalarFieldEnum[]
  }

  /**
   * BodyArea create
   */
  export type BodyAreaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BodyAreaInclude<ExtArgs> | null
    /**
     * The data needed to create a BodyArea.
     */
    data: XOR<BodyAreaCreateInput, BodyAreaUncheckedCreateInput>
  }

  /**
   * BodyArea createMany
   */
  export type BodyAreaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BodyAreas.
     */
    data: BodyAreaCreateManyInput | BodyAreaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BodyArea createManyAndReturn
   */
  export type BodyAreaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * The data used to create many BodyAreas.
     */
    data: BodyAreaCreateManyInput | BodyAreaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BodyArea update
   */
  export type BodyAreaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BodyAreaInclude<ExtArgs> | null
    /**
     * The data needed to update a BodyArea.
     */
    data: XOR<BodyAreaUpdateInput, BodyAreaUncheckedUpdateInput>
    /**
     * Choose, which BodyArea to update.
     */
    where: BodyAreaWhereUniqueInput
  }

  /**
   * BodyArea updateMany
   */
  export type BodyAreaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BodyAreas.
     */
    data: XOR<BodyAreaUpdateManyMutationInput, BodyAreaUncheckedUpdateManyInput>
    /**
     * Filter which BodyAreas to update
     */
    where?: BodyAreaWhereInput
    /**
     * Limit how many BodyAreas to update.
     */
    limit?: number
  }

  /**
   * BodyArea updateManyAndReturn
   */
  export type BodyAreaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * The data used to update BodyAreas.
     */
    data: XOR<BodyAreaUpdateManyMutationInput, BodyAreaUncheckedUpdateManyInput>
    /**
     * Filter which BodyAreas to update
     */
    where?: BodyAreaWhereInput
    /**
     * Limit how many BodyAreas to update.
     */
    limit?: number
  }

  /**
   * BodyArea upsert
   */
  export type BodyAreaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BodyAreaInclude<ExtArgs> | null
    /**
     * The filter to search for the BodyArea to update in case it exists.
     */
    where: BodyAreaWhereUniqueInput
    /**
     * In case the BodyArea found by the `where` argument doesn't exist, create a new BodyArea with this data.
     */
    create: XOR<BodyAreaCreateInput, BodyAreaUncheckedCreateInput>
    /**
     * In case the BodyArea was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BodyAreaUpdateInput, BodyAreaUncheckedUpdateInput>
  }

  /**
   * BodyArea delete
   */
  export type BodyAreaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BodyAreaInclude<ExtArgs> | null
    /**
     * Filter which BodyArea to delete.
     */
    where: BodyAreaWhereUniqueInput
  }

  /**
   * BodyArea deleteMany
   */
  export type BodyAreaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BodyAreas to delete
     */
    where?: BodyAreaWhereInput
    /**
     * Limit how many BodyAreas to delete.
     */
    limit?: number
  }

  /**
   * BodyArea.muscleGroups
   */
  export type BodyArea$muscleGroupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
    where?: MuscleGroupWhereInput
    orderBy?: MuscleGroupOrderByWithRelationInput | MuscleGroupOrderByWithRelationInput[]
    cursor?: MuscleGroupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MuscleGroupScalarFieldEnum | MuscleGroupScalarFieldEnum[]
  }

  /**
   * BodyArea without action
   */
  export type BodyAreaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BodyArea
     */
    select?: BodyAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BodyArea
     */
    omit?: BodyAreaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BodyAreaInclude<ExtArgs> | null
  }


  /**
   * Model MuscleGroup
   */

  export type AggregateMuscleGroup = {
    _count: MuscleGroupCountAggregateOutputType | null
    _avg: MuscleGroupAvgAggregateOutputType | null
    _sum: MuscleGroupSumAggregateOutputType | null
    _min: MuscleGroupMinAggregateOutputType | null
    _max: MuscleGroupMaxAggregateOutputType | null
  }

  export type MuscleGroupAvgAggregateOutputType = {
    id: number | null
    bodyAreaId: number | null
  }

  export type MuscleGroupSumAggregateOutputType = {
    id: number | null
    bodyAreaId: number | null
  }

  export type MuscleGroupMinAggregateOutputType = {
    id: number | null
    label: $Enums.MuscleGroupLabel | null
    bodyAreaId: number | null
  }

  export type MuscleGroupMaxAggregateOutputType = {
    id: number | null
    label: $Enums.MuscleGroupLabel | null
    bodyAreaId: number | null
  }

  export type MuscleGroupCountAggregateOutputType = {
    id: number
    label: number
    bodyAreaId: number
    _all: number
  }


  export type MuscleGroupAvgAggregateInputType = {
    id?: true
    bodyAreaId?: true
  }

  export type MuscleGroupSumAggregateInputType = {
    id?: true
    bodyAreaId?: true
  }

  export type MuscleGroupMinAggregateInputType = {
    id?: true
    label?: true
    bodyAreaId?: true
  }

  export type MuscleGroupMaxAggregateInputType = {
    id?: true
    label?: true
    bodyAreaId?: true
  }

  export type MuscleGroupCountAggregateInputType = {
    id?: true
    label?: true
    bodyAreaId?: true
    _all?: true
  }

  export type MuscleGroupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MuscleGroup to aggregate.
     */
    where?: MuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MuscleGroups to fetch.
     */
    orderBy?: MuscleGroupOrderByWithRelationInput | MuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MuscleGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MuscleGroups
    **/
    _count?: true | MuscleGroupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MuscleGroupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MuscleGroupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MuscleGroupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MuscleGroupMaxAggregateInputType
  }

  export type GetMuscleGroupAggregateType<T extends MuscleGroupAggregateArgs> = {
        [P in keyof T & keyof AggregateMuscleGroup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMuscleGroup[P]>
      : GetScalarType<T[P], AggregateMuscleGroup[P]>
  }




  export type MuscleGroupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MuscleGroupWhereInput
    orderBy?: MuscleGroupOrderByWithAggregationInput | MuscleGroupOrderByWithAggregationInput[]
    by: MuscleGroupScalarFieldEnum[] | MuscleGroupScalarFieldEnum
    having?: MuscleGroupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MuscleGroupCountAggregateInputType | true
    _avg?: MuscleGroupAvgAggregateInputType
    _sum?: MuscleGroupSumAggregateInputType
    _min?: MuscleGroupMinAggregateInputType
    _max?: MuscleGroupMaxAggregateInputType
  }

  export type MuscleGroupGroupByOutputType = {
    id: number
    label: $Enums.MuscleGroupLabel
    bodyAreaId: number
    _count: MuscleGroupCountAggregateOutputType | null
    _avg: MuscleGroupAvgAggregateOutputType | null
    _sum: MuscleGroupSumAggregateOutputType | null
    _min: MuscleGroupMinAggregateOutputType | null
    _max: MuscleGroupMaxAggregateOutputType | null
  }

  type GetMuscleGroupGroupByPayload<T extends MuscleGroupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MuscleGroupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MuscleGroupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MuscleGroupGroupByOutputType[P]>
            : GetScalarType<T[P], MuscleGroupGroupByOutputType[P]>
        }
      >
    >


  export type MuscleGroupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    bodyAreaId?: boolean
    bodyArea?: boolean | BodyAreaDefaultArgs<ExtArgs>
    primaryExercises?: boolean | MuscleGroup$primaryExercisesArgs<ExtArgs>
    secondaryExercises?: boolean | MuscleGroup$secondaryExercisesArgs<ExtArgs>
    _count?: boolean | MuscleGroupCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["muscleGroup"]>

  export type MuscleGroupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    bodyAreaId?: boolean
    bodyArea?: boolean | BodyAreaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["muscleGroup"]>

  export type MuscleGroupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    bodyAreaId?: boolean
    bodyArea?: boolean | BodyAreaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["muscleGroup"]>

  export type MuscleGroupSelectScalar = {
    id?: boolean
    label?: boolean
    bodyAreaId?: boolean
  }

  export type MuscleGroupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "label" | "bodyAreaId", ExtArgs["result"]["muscleGroup"]>
  export type MuscleGroupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bodyArea?: boolean | BodyAreaDefaultArgs<ExtArgs>
    primaryExercises?: boolean | MuscleGroup$primaryExercisesArgs<ExtArgs>
    secondaryExercises?: boolean | MuscleGroup$secondaryExercisesArgs<ExtArgs>
    _count?: boolean | MuscleGroupCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MuscleGroupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bodyArea?: boolean | BodyAreaDefaultArgs<ExtArgs>
  }
  export type MuscleGroupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bodyArea?: boolean | BodyAreaDefaultArgs<ExtArgs>
  }

  export type $MuscleGroupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MuscleGroup"
    objects: {
      bodyArea: Prisma.$BodyAreaPayload<ExtArgs>
      primaryExercises: Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>[]
      secondaryExercises: Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      label: $Enums.MuscleGroupLabel
      bodyAreaId: number
    }, ExtArgs["result"]["muscleGroup"]>
    composites: {}
  }

  type MuscleGroupGetPayload<S extends boolean | null | undefined | MuscleGroupDefaultArgs> = $Result.GetResult<Prisma.$MuscleGroupPayload, S>

  type MuscleGroupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MuscleGroupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MuscleGroupCountAggregateInputType | true
    }

  export interface MuscleGroupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MuscleGroup'], meta: { name: 'MuscleGroup' } }
    /**
     * Find zero or one MuscleGroup that matches the filter.
     * @param {MuscleGroupFindUniqueArgs} args - Arguments to find a MuscleGroup
     * @example
     * // Get one MuscleGroup
     * const muscleGroup = await prisma.muscleGroup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MuscleGroupFindUniqueArgs>(args: SelectSubset<T, MuscleGroupFindUniqueArgs<ExtArgs>>): Prisma__MuscleGroupClient<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MuscleGroup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MuscleGroupFindUniqueOrThrowArgs} args - Arguments to find a MuscleGroup
     * @example
     * // Get one MuscleGroup
     * const muscleGroup = await prisma.muscleGroup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MuscleGroupFindUniqueOrThrowArgs>(args: SelectSubset<T, MuscleGroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MuscleGroupClient<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MuscleGroup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuscleGroupFindFirstArgs} args - Arguments to find a MuscleGroup
     * @example
     * // Get one MuscleGroup
     * const muscleGroup = await prisma.muscleGroup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MuscleGroupFindFirstArgs>(args?: SelectSubset<T, MuscleGroupFindFirstArgs<ExtArgs>>): Prisma__MuscleGroupClient<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MuscleGroup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuscleGroupFindFirstOrThrowArgs} args - Arguments to find a MuscleGroup
     * @example
     * // Get one MuscleGroup
     * const muscleGroup = await prisma.muscleGroup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MuscleGroupFindFirstOrThrowArgs>(args?: SelectSubset<T, MuscleGroupFindFirstOrThrowArgs<ExtArgs>>): Prisma__MuscleGroupClient<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MuscleGroups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuscleGroupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MuscleGroups
     * const muscleGroups = await prisma.muscleGroup.findMany()
     * 
     * // Get first 10 MuscleGroups
     * const muscleGroups = await prisma.muscleGroup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const muscleGroupWithIdOnly = await prisma.muscleGroup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MuscleGroupFindManyArgs>(args?: SelectSubset<T, MuscleGroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MuscleGroup.
     * @param {MuscleGroupCreateArgs} args - Arguments to create a MuscleGroup.
     * @example
     * // Create one MuscleGroup
     * const MuscleGroup = await prisma.muscleGroup.create({
     *   data: {
     *     // ... data to create a MuscleGroup
     *   }
     * })
     * 
     */
    create<T extends MuscleGroupCreateArgs>(args: SelectSubset<T, MuscleGroupCreateArgs<ExtArgs>>): Prisma__MuscleGroupClient<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MuscleGroups.
     * @param {MuscleGroupCreateManyArgs} args - Arguments to create many MuscleGroups.
     * @example
     * // Create many MuscleGroups
     * const muscleGroup = await prisma.muscleGroup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MuscleGroupCreateManyArgs>(args?: SelectSubset<T, MuscleGroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MuscleGroups and returns the data saved in the database.
     * @param {MuscleGroupCreateManyAndReturnArgs} args - Arguments to create many MuscleGroups.
     * @example
     * // Create many MuscleGroups
     * const muscleGroup = await prisma.muscleGroup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MuscleGroups and only return the `id`
     * const muscleGroupWithIdOnly = await prisma.muscleGroup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MuscleGroupCreateManyAndReturnArgs>(args?: SelectSubset<T, MuscleGroupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MuscleGroup.
     * @param {MuscleGroupDeleteArgs} args - Arguments to delete one MuscleGroup.
     * @example
     * // Delete one MuscleGroup
     * const MuscleGroup = await prisma.muscleGroup.delete({
     *   where: {
     *     // ... filter to delete one MuscleGroup
     *   }
     * })
     * 
     */
    delete<T extends MuscleGroupDeleteArgs>(args: SelectSubset<T, MuscleGroupDeleteArgs<ExtArgs>>): Prisma__MuscleGroupClient<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MuscleGroup.
     * @param {MuscleGroupUpdateArgs} args - Arguments to update one MuscleGroup.
     * @example
     * // Update one MuscleGroup
     * const muscleGroup = await prisma.muscleGroup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MuscleGroupUpdateArgs>(args: SelectSubset<T, MuscleGroupUpdateArgs<ExtArgs>>): Prisma__MuscleGroupClient<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MuscleGroups.
     * @param {MuscleGroupDeleteManyArgs} args - Arguments to filter MuscleGroups to delete.
     * @example
     * // Delete a few MuscleGroups
     * const { count } = await prisma.muscleGroup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MuscleGroupDeleteManyArgs>(args?: SelectSubset<T, MuscleGroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MuscleGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuscleGroupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MuscleGroups
     * const muscleGroup = await prisma.muscleGroup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MuscleGroupUpdateManyArgs>(args: SelectSubset<T, MuscleGroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MuscleGroups and returns the data updated in the database.
     * @param {MuscleGroupUpdateManyAndReturnArgs} args - Arguments to update many MuscleGroups.
     * @example
     * // Update many MuscleGroups
     * const muscleGroup = await prisma.muscleGroup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MuscleGroups and only return the `id`
     * const muscleGroupWithIdOnly = await prisma.muscleGroup.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MuscleGroupUpdateManyAndReturnArgs>(args: SelectSubset<T, MuscleGroupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MuscleGroup.
     * @param {MuscleGroupUpsertArgs} args - Arguments to update or create a MuscleGroup.
     * @example
     * // Update or create a MuscleGroup
     * const muscleGroup = await prisma.muscleGroup.upsert({
     *   create: {
     *     // ... data to create a MuscleGroup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MuscleGroup we want to update
     *   }
     * })
     */
    upsert<T extends MuscleGroupUpsertArgs>(args: SelectSubset<T, MuscleGroupUpsertArgs<ExtArgs>>): Prisma__MuscleGroupClient<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MuscleGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuscleGroupCountArgs} args - Arguments to filter MuscleGroups to count.
     * @example
     * // Count the number of MuscleGroups
     * const count = await prisma.muscleGroup.count({
     *   where: {
     *     // ... the filter for the MuscleGroups we want to count
     *   }
     * })
    **/
    count<T extends MuscleGroupCountArgs>(
      args?: Subset<T, MuscleGroupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MuscleGroupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MuscleGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuscleGroupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MuscleGroupAggregateArgs>(args: Subset<T, MuscleGroupAggregateArgs>): Prisma.PrismaPromise<GetMuscleGroupAggregateType<T>>

    /**
     * Group by MuscleGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuscleGroupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MuscleGroupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MuscleGroupGroupByArgs['orderBy'] }
        : { orderBy?: MuscleGroupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MuscleGroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMuscleGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MuscleGroup model
   */
  readonly fields: MuscleGroupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MuscleGroup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MuscleGroupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bodyArea<T extends BodyAreaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BodyAreaDefaultArgs<ExtArgs>>): Prisma__BodyAreaClient<$Result.GetResult<Prisma.$BodyAreaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    primaryExercises<T extends MuscleGroup$primaryExercisesArgs<ExtArgs> = {}>(args?: Subset<T, MuscleGroup$primaryExercisesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    secondaryExercises<T extends MuscleGroup$secondaryExercisesArgs<ExtArgs> = {}>(args?: Subset<T, MuscleGroup$secondaryExercisesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MuscleGroup model
   */
  interface MuscleGroupFieldRefs {
    readonly id: FieldRef<"MuscleGroup", 'Int'>
    readonly label: FieldRef<"MuscleGroup", 'MuscleGroupLabel'>
    readonly bodyAreaId: FieldRef<"MuscleGroup", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * MuscleGroup findUnique
   */
  export type MuscleGroupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which MuscleGroup to fetch.
     */
    where: MuscleGroupWhereUniqueInput
  }

  /**
   * MuscleGroup findUniqueOrThrow
   */
  export type MuscleGroupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which MuscleGroup to fetch.
     */
    where: MuscleGroupWhereUniqueInput
  }

  /**
   * MuscleGroup findFirst
   */
  export type MuscleGroupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which MuscleGroup to fetch.
     */
    where?: MuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MuscleGroups to fetch.
     */
    orderBy?: MuscleGroupOrderByWithRelationInput | MuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MuscleGroups.
     */
    cursor?: MuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MuscleGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MuscleGroups.
     */
    distinct?: MuscleGroupScalarFieldEnum | MuscleGroupScalarFieldEnum[]
  }

  /**
   * MuscleGroup findFirstOrThrow
   */
  export type MuscleGroupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which MuscleGroup to fetch.
     */
    where?: MuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MuscleGroups to fetch.
     */
    orderBy?: MuscleGroupOrderByWithRelationInput | MuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MuscleGroups.
     */
    cursor?: MuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MuscleGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MuscleGroups.
     */
    distinct?: MuscleGroupScalarFieldEnum | MuscleGroupScalarFieldEnum[]
  }

  /**
   * MuscleGroup findMany
   */
  export type MuscleGroupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which MuscleGroups to fetch.
     */
    where?: MuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MuscleGroups to fetch.
     */
    orderBy?: MuscleGroupOrderByWithRelationInput | MuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MuscleGroups.
     */
    cursor?: MuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MuscleGroups.
     */
    skip?: number
    distinct?: MuscleGroupScalarFieldEnum | MuscleGroupScalarFieldEnum[]
  }

  /**
   * MuscleGroup create
   */
  export type MuscleGroupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
    /**
     * The data needed to create a MuscleGroup.
     */
    data: XOR<MuscleGroupCreateInput, MuscleGroupUncheckedCreateInput>
  }

  /**
   * MuscleGroup createMany
   */
  export type MuscleGroupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MuscleGroups.
     */
    data: MuscleGroupCreateManyInput | MuscleGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MuscleGroup createManyAndReturn
   */
  export type MuscleGroupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * The data used to create many MuscleGroups.
     */
    data: MuscleGroupCreateManyInput | MuscleGroupCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MuscleGroup update
   */
  export type MuscleGroupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
    /**
     * The data needed to update a MuscleGroup.
     */
    data: XOR<MuscleGroupUpdateInput, MuscleGroupUncheckedUpdateInput>
    /**
     * Choose, which MuscleGroup to update.
     */
    where: MuscleGroupWhereUniqueInput
  }

  /**
   * MuscleGroup updateMany
   */
  export type MuscleGroupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MuscleGroups.
     */
    data: XOR<MuscleGroupUpdateManyMutationInput, MuscleGroupUncheckedUpdateManyInput>
    /**
     * Filter which MuscleGroups to update
     */
    where?: MuscleGroupWhereInput
    /**
     * Limit how many MuscleGroups to update.
     */
    limit?: number
  }

  /**
   * MuscleGroup updateManyAndReturn
   */
  export type MuscleGroupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * The data used to update MuscleGroups.
     */
    data: XOR<MuscleGroupUpdateManyMutationInput, MuscleGroupUncheckedUpdateManyInput>
    /**
     * Filter which MuscleGroups to update
     */
    where?: MuscleGroupWhereInput
    /**
     * Limit how many MuscleGroups to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MuscleGroup upsert
   */
  export type MuscleGroupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
    /**
     * The filter to search for the MuscleGroup to update in case it exists.
     */
    where: MuscleGroupWhereUniqueInput
    /**
     * In case the MuscleGroup found by the `where` argument doesn't exist, create a new MuscleGroup with this data.
     */
    create: XOR<MuscleGroupCreateInput, MuscleGroupUncheckedCreateInput>
    /**
     * In case the MuscleGroup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MuscleGroupUpdateInput, MuscleGroupUncheckedUpdateInput>
  }

  /**
   * MuscleGroup delete
   */
  export type MuscleGroupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
    /**
     * Filter which MuscleGroup to delete.
     */
    where: MuscleGroupWhereUniqueInput
  }

  /**
   * MuscleGroup deleteMany
   */
  export type MuscleGroupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MuscleGroups to delete
     */
    where?: MuscleGroupWhereInput
    /**
     * Limit how many MuscleGroups to delete.
     */
    limit?: number
  }

  /**
   * MuscleGroup.primaryExercises
   */
  export type MuscleGroup$primaryExercisesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    where?: ExercisePrimaryMuscleGroupWhereInput
    orderBy?: ExercisePrimaryMuscleGroupOrderByWithRelationInput | ExercisePrimaryMuscleGroupOrderByWithRelationInput[]
    cursor?: ExercisePrimaryMuscleGroupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExercisePrimaryMuscleGroupScalarFieldEnum | ExercisePrimaryMuscleGroupScalarFieldEnum[]
  }

  /**
   * MuscleGroup.secondaryExercises
   */
  export type MuscleGroup$secondaryExercisesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    where?: ExerciseSecondaryMuscleGroupWhereInput
    orderBy?: ExerciseSecondaryMuscleGroupOrderByWithRelationInput | ExerciseSecondaryMuscleGroupOrderByWithRelationInput[]
    cursor?: ExerciseSecondaryMuscleGroupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExerciseSecondaryMuscleGroupScalarFieldEnum | ExerciseSecondaryMuscleGroupScalarFieldEnum[]
  }

  /**
   * MuscleGroup without action
   */
  export type MuscleGroupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuscleGroup
     */
    select?: MuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MuscleGroup
     */
    omit?: MuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MuscleGroupInclude<ExtArgs> | null
  }


  /**
   * Model Exercise
   */

  export type AggregateExercise = {
    _count: ExerciseCountAggregateOutputType | null
    _avg: ExerciseAvgAggregateOutputType | null
    _sum: ExerciseSumAggregateOutputType | null
    _min: ExerciseMinAggregateOutputType | null
    _max: ExerciseMaxAggregateOutputType | null
  }

  export type ExerciseAvgAggregateOutputType = {
    id: number | null
  }

  export type ExerciseSumAggregateOutputType = {
    id: number | null
  }

  export type ExerciseMinAggregateOutputType = {
    id: number | null
    label: string | null
    recordSetsType: $Enums.RecordSetsType | null
    createdAt: Date | null
  }

  export type ExerciseMaxAggregateOutputType = {
    id: number | null
    label: string | null
    recordSetsType: $Enums.RecordSetsType | null
    createdAt: Date | null
  }

  export type ExerciseCountAggregateOutputType = {
    id: number
    label: number
    recordSetsType: number
    createdAt: number
    _all: number
  }


  export type ExerciseAvgAggregateInputType = {
    id?: true
  }

  export type ExerciseSumAggregateInputType = {
    id?: true
  }

  export type ExerciseMinAggregateInputType = {
    id?: true
    label?: true
    recordSetsType?: true
    createdAt?: true
  }

  export type ExerciseMaxAggregateInputType = {
    id?: true
    label?: true
    recordSetsType?: true
    createdAt?: true
  }

  export type ExerciseCountAggregateInputType = {
    id?: true
    label?: true
    recordSetsType?: true
    createdAt?: true
    _all?: true
  }

  export type ExerciseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exercise to aggregate.
     */
    where?: ExerciseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exercises to fetch.
     */
    orderBy?: ExerciseOrderByWithRelationInput | ExerciseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExerciseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exercises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exercises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Exercises
    **/
    _count?: true | ExerciseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExerciseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExerciseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExerciseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExerciseMaxAggregateInputType
  }

  export type GetExerciseAggregateType<T extends ExerciseAggregateArgs> = {
        [P in keyof T & keyof AggregateExercise]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExercise[P]>
      : GetScalarType<T[P], AggregateExercise[P]>
  }




  export type ExerciseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseWhereInput
    orderBy?: ExerciseOrderByWithAggregationInput | ExerciseOrderByWithAggregationInput[]
    by: ExerciseScalarFieldEnum[] | ExerciseScalarFieldEnum
    having?: ExerciseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExerciseCountAggregateInputType | true
    _avg?: ExerciseAvgAggregateInputType
    _sum?: ExerciseSumAggregateInputType
    _min?: ExerciseMinAggregateInputType
    _max?: ExerciseMaxAggregateInputType
  }

  export type ExerciseGroupByOutputType = {
    id: number
    label: string
    recordSetsType: $Enums.RecordSetsType
    createdAt: Date
    _count: ExerciseCountAggregateOutputType | null
    _avg: ExerciseAvgAggregateOutputType | null
    _sum: ExerciseSumAggregateOutputType | null
    _min: ExerciseMinAggregateOutputType | null
    _max: ExerciseMaxAggregateOutputType | null
  }

  type GetExerciseGroupByPayload<T extends ExerciseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExerciseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExerciseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExerciseGroupByOutputType[P]>
            : GetScalarType<T[P], ExerciseGroupByOutputType[P]>
        }
      >
    >


  export type ExerciseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    recordSetsType?: boolean
    createdAt?: boolean
    primaryMuscleGroups?: boolean | Exercise$primaryMuscleGroupsArgs<ExtArgs>
    secondaryMuscleGroups?: boolean | Exercise$secondaryMuscleGroupsArgs<ExtArgs>
    _count?: boolean | ExerciseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exercise"]>

  export type ExerciseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    recordSetsType?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["exercise"]>

  export type ExerciseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    recordSetsType?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["exercise"]>

  export type ExerciseSelectScalar = {
    id?: boolean
    label?: boolean
    recordSetsType?: boolean
    createdAt?: boolean
  }

  export type ExerciseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "label" | "recordSetsType" | "createdAt", ExtArgs["result"]["exercise"]>
  export type ExerciseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    primaryMuscleGroups?: boolean | Exercise$primaryMuscleGroupsArgs<ExtArgs>
    secondaryMuscleGroups?: boolean | Exercise$secondaryMuscleGroupsArgs<ExtArgs>
    _count?: boolean | ExerciseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExerciseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ExerciseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ExercisePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Exercise"
    objects: {
      primaryMuscleGroups: Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>[]
      secondaryMuscleGroups: Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      label: string
      recordSetsType: $Enums.RecordSetsType
      createdAt: Date
    }, ExtArgs["result"]["exercise"]>
    composites: {}
  }

  type ExerciseGetPayload<S extends boolean | null | undefined | ExerciseDefaultArgs> = $Result.GetResult<Prisma.$ExercisePayload, S>

  type ExerciseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExerciseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExerciseCountAggregateInputType | true
    }

  export interface ExerciseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Exercise'], meta: { name: 'Exercise' } }
    /**
     * Find zero or one Exercise that matches the filter.
     * @param {ExerciseFindUniqueArgs} args - Arguments to find a Exercise
     * @example
     * // Get one Exercise
     * const exercise = await prisma.exercise.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExerciseFindUniqueArgs>(args: SelectSubset<T, ExerciseFindUniqueArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Exercise that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExerciseFindUniqueOrThrowArgs} args - Arguments to find a Exercise
     * @example
     * // Get one Exercise
     * const exercise = await prisma.exercise.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExerciseFindUniqueOrThrowArgs>(args: SelectSubset<T, ExerciseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exercise that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseFindFirstArgs} args - Arguments to find a Exercise
     * @example
     * // Get one Exercise
     * const exercise = await prisma.exercise.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExerciseFindFirstArgs>(args?: SelectSubset<T, ExerciseFindFirstArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exercise that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseFindFirstOrThrowArgs} args - Arguments to find a Exercise
     * @example
     * // Get one Exercise
     * const exercise = await prisma.exercise.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExerciseFindFirstOrThrowArgs>(args?: SelectSubset<T, ExerciseFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Exercises that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Exercises
     * const exercises = await prisma.exercise.findMany()
     * 
     * // Get first 10 Exercises
     * const exercises = await prisma.exercise.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exerciseWithIdOnly = await prisma.exercise.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExerciseFindManyArgs>(args?: SelectSubset<T, ExerciseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Exercise.
     * @param {ExerciseCreateArgs} args - Arguments to create a Exercise.
     * @example
     * // Create one Exercise
     * const Exercise = await prisma.exercise.create({
     *   data: {
     *     // ... data to create a Exercise
     *   }
     * })
     * 
     */
    create<T extends ExerciseCreateArgs>(args: SelectSubset<T, ExerciseCreateArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Exercises.
     * @param {ExerciseCreateManyArgs} args - Arguments to create many Exercises.
     * @example
     * // Create many Exercises
     * const exercise = await prisma.exercise.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExerciseCreateManyArgs>(args?: SelectSubset<T, ExerciseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Exercises and returns the data saved in the database.
     * @param {ExerciseCreateManyAndReturnArgs} args - Arguments to create many Exercises.
     * @example
     * // Create many Exercises
     * const exercise = await prisma.exercise.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Exercises and only return the `id`
     * const exerciseWithIdOnly = await prisma.exercise.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExerciseCreateManyAndReturnArgs>(args?: SelectSubset<T, ExerciseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Exercise.
     * @param {ExerciseDeleteArgs} args - Arguments to delete one Exercise.
     * @example
     * // Delete one Exercise
     * const Exercise = await prisma.exercise.delete({
     *   where: {
     *     // ... filter to delete one Exercise
     *   }
     * })
     * 
     */
    delete<T extends ExerciseDeleteArgs>(args: SelectSubset<T, ExerciseDeleteArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Exercise.
     * @param {ExerciseUpdateArgs} args - Arguments to update one Exercise.
     * @example
     * // Update one Exercise
     * const exercise = await prisma.exercise.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExerciseUpdateArgs>(args: SelectSubset<T, ExerciseUpdateArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Exercises.
     * @param {ExerciseDeleteManyArgs} args - Arguments to filter Exercises to delete.
     * @example
     * // Delete a few Exercises
     * const { count } = await prisma.exercise.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExerciseDeleteManyArgs>(args?: SelectSubset<T, ExerciseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exercises.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Exercises
     * const exercise = await prisma.exercise.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExerciseUpdateManyArgs>(args: SelectSubset<T, ExerciseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exercises and returns the data updated in the database.
     * @param {ExerciseUpdateManyAndReturnArgs} args - Arguments to update many Exercises.
     * @example
     * // Update many Exercises
     * const exercise = await prisma.exercise.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Exercises and only return the `id`
     * const exerciseWithIdOnly = await prisma.exercise.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExerciseUpdateManyAndReturnArgs>(args: SelectSubset<T, ExerciseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Exercise.
     * @param {ExerciseUpsertArgs} args - Arguments to update or create a Exercise.
     * @example
     * // Update or create a Exercise
     * const exercise = await prisma.exercise.upsert({
     *   create: {
     *     // ... data to create a Exercise
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Exercise we want to update
     *   }
     * })
     */
    upsert<T extends ExerciseUpsertArgs>(args: SelectSubset<T, ExerciseUpsertArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Exercises.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseCountArgs} args - Arguments to filter Exercises to count.
     * @example
     * // Count the number of Exercises
     * const count = await prisma.exercise.count({
     *   where: {
     *     // ... the filter for the Exercises we want to count
     *   }
     * })
    **/
    count<T extends ExerciseCountArgs>(
      args?: Subset<T, ExerciseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExerciseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Exercise.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExerciseAggregateArgs>(args: Subset<T, ExerciseAggregateArgs>): Prisma.PrismaPromise<GetExerciseAggregateType<T>>

    /**
     * Group by Exercise.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExerciseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExerciseGroupByArgs['orderBy'] }
        : { orderBy?: ExerciseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExerciseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExerciseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Exercise model
   */
  readonly fields: ExerciseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Exercise.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExerciseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    primaryMuscleGroups<T extends Exercise$primaryMuscleGroupsArgs<ExtArgs> = {}>(args?: Subset<T, Exercise$primaryMuscleGroupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    secondaryMuscleGroups<T extends Exercise$secondaryMuscleGroupsArgs<ExtArgs> = {}>(args?: Subset<T, Exercise$secondaryMuscleGroupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Exercise model
   */
  interface ExerciseFieldRefs {
    readonly id: FieldRef<"Exercise", 'Int'>
    readonly label: FieldRef<"Exercise", 'String'>
    readonly recordSetsType: FieldRef<"Exercise", 'RecordSetsType'>
    readonly createdAt: FieldRef<"Exercise", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Exercise findUnique
   */
  export type ExerciseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter, which Exercise to fetch.
     */
    where: ExerciseWhereUniqueInput
  }

  /**
   * Exercise findUniqueOrThrow
   */
  export type ExerciseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter, which Exercise to fetch.
     */
    where: ExerciseWhereUniqueInput
  }

  /**
   * Exercise findFirst
   */
  export type ExerciseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter, which Exercise to fetch.
     */
    where?: ExerciseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exercises to fetch.
     */
    orderBy?: ExerciseOrderByWithRelationInput | ExerciseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exercises.
     */
    cursor?: ExerciseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exercises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exercises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exercises.
     */
    distinct?: ExerciseScalarFieldEnum | ExerciseScalarFieldEnum[]
  }

  /**
   * Exercise findFirstOrThrow
   */
  export type ExerciseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter, which Exercise to fetch.
     */
    where?: ExerciseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exercises to fetch.
     */
    orderBy?: ExerciseOrderByWithRelationInput | ExerciseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exercises.
     */
    cursor?: ExerciseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exercises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exercises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exercises.
     */
    distinct?: ExerciseScalarFieldEnum | ExerciseScalarFieldEnum[]
  }

  /**
   * Exercise findMany
   */
  export type ExerciseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter, which Exercises to fetch.
     */
    where?: ExerciseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exercises to fetch.
     */
    orderBy?: ExerciseOrderByWithRelationInput | ExerciseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Exercises.
     */
    cursor?: ExerciseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exercises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exercises.
     */
    skip?: number
    distinct?: ExerciseScalarFieldEnum | ExerciseScalarFieldEnum[]
  }

  /**
   * Exercise create
   */
  export type ExerciseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * The data needed to create a Exercise.
     */
    data: XOR<ExerciseCreateInput, ExerciseUncheckedCreateInput>
  }

  /**
   * Exercise createMany
   */
  export type ExerciseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Exercises.
     */
    data: ExerciseCreateManyInput | ExerciseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Exercise createManyAndReturn
   */
  export type ExerciseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * The data used to create many Exercises.
     */
    data: ExerciseCreateManyInput | ExerciseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Exercise update
   */
  export type ExerciseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * The data needed to update a Exercise.
     */
    data: XOR<ExerciseUpdateInput, ExerciseUncheckedUpdateInput>
    /**
     * Choose, which Exercise to update.
     */
    where: ExerciseWhereUniqueInput
  }

  /**
   * Exercise updateMany
   */
  export type ExerciseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Exercises.
     */
    data: XOR<ExerciseUpdateManyMutationInput, ExerciseUncheckedUpdateManyInput>
    /**
     * Filter which Exercises to update
     */
    where?: ExerciseWhereInput
    /**
     * Limit how many Exercises to update.
     */
    limit?: number
  }

  /**
   * Exercise updateManyAndReturn
   */
  export type ExerciseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * The data used to update Exercises.
     */
    data: XOR<ExerciseUpdateManyMutationInput, ExerciseUncheckedUpdateManyInput>
    /**
     * Filter which Exercises to update
     */
    where?: ExerciseWhereInput
    /**
     * Limit how many Exercises to update.
     */
    limit?: number
  }

  /**
   * Exercise upsert
   */
  export type ExerciseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * The filter to search for the Exercise to update in case it exists.
     */
    where: ExerciseWhereUniqueInput
    /**
     * In case the Exercise found by the `where` argument doesn't exist, create a new Exercise with this data.
     */
    create: XOR<ExerciseCreateInput, ExerciseUncheckedCreateInput>
    /**
     * In case the Exercise was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExerciseUpdateInput, ExerciseUncheckedUpdateInput>
  }

  /**
   * Exercise delete
   */
  export type ExerciseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter which Exercise to delete.
     */
    where: ExerciseWhereUniqueInput
  }

  /**
   * Exercise deleteMany
   */
  export type ExerciseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exercises to delete
     */
    where?: ExerciseWhereInput
    /**
     * Limit how many Exercises to delete.
     */
    limit?: number
  }

  /**
   * Exercise.primaryMuscleGroups
   */
  export type Exercise$primaryMuscleGroupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    where?: ExercisePrimaryMuscleGroupWhereInput
    orderBy?: ExercisePrimaryMuscleGroupOrderByWithRelationInput | ExercisePrimaryMuscleGroupOrderByWithRelationInput[]
    cursor?: ExercisePrimaryMuscleGroupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExercisePrimaryMuscleGroupScalarFieldEnum | ExercisePrimaryMuscleGroupScalarFieldEnum[]
  }

  /**
   * Exercise.secondaryMuscleGroups
   */
  export type Exercise$secondaryMuscleGroupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    where?: ExerciseSecondaryMuscleGroupWhereInput
    orderBy?: ExerciseSecondaryMuscleGroupOrderByWithRelationInput | ExerciseSecondaryMuscleGroupOrderByWithRelationInput[]
    cursor?: ExerciseSecondaryMuscleGroupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExerciseSecondaryMuscleGroupScalarFieldEnum | ExerciseSecondaryMuscleGroupScalarFieldEnum[]
  }

  /**
   * Exercise without action
   */
  export type ExerciseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
  }


  /**
   * Model ExercisePrimaryMuscleGroup
   */

  export type AggregateExercisePrimaryMuscleGroup = {
    _count: ExercisePrimaryMuscleGroupCountAggregateOutputType | null
    _avg: ExercisePrimaryMuscleGroupAvgAggregateOutputType | null
    _sum: ExercisePrimaryMuscleGroupSumAggregateOutputType | null
    _min: ExercisePrimaryMuscleGroupMinAggregateOutputType | null
    _max: ExercisePrimaryMuscleGroupMaxAggregateOutputType | null
  }

  export type ExercisePrimaryMuscleGroupAvgAggregateOutputType = {
    exerciseId: number | null
    muscleGroupId: number | null
  }

  export type ExercisePrimaryMuscleGroupSumAggregateOutputType = {
    exerciseId: number | null
    muscleGroupId: number | null
  }

  export type ExercisePrimaryMuscleGroupMinAggregateOutputType = {
    exerciseId: number | null
    muscleGroupId: number | null
  }

  export type ExercisePrimaryMuscleGroupMaxAggregateOutputType = {
    exerciseId: number | null
    muscleGroupId: number | null
  }

  export type ExercisePrimaryMuscleGroupCountAggregateOutputType = {
    exerciseId: number
    muscleGroupId: number
    _all: number
  }


  export type ExercisePrimaryMuscleGroupAvgAggregateInputType = {
    exerciseId?: true
    muscleGroupId?: true
  }

  export type ExercisePrimaryMuscleGroupSumAggregateInputType = {
    exerciseId?: true
    muscleGroupId?: true
  }

  export type ExercisePrimaryMuscleGroupMinAggregateInputType = {
    exerciseId?: true
    muscleGroupId?: true
  }

  export type ExercisePrimaryMuscleGroupMaxAggregateInputType = {
    exerciseId?: true
    muscleGroupId?: true
  }

  export type ExercisePrimaryMuscleGroupCountAggregateInputType = {
    exerciseId?: true
    muscleGroupId?: true
    _all?: true
  }

  export type ExercisePrimaryMuscleGroupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExercisePrimaryMuscleGroup to aggregate.
     */
    where?: ExercisePrimaryMuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExercisePrimaryMuscleGroups to fetch.
     */
    orderBy?: ExercisePrimaryMuscleGroupOrderByWithRelationInput | ExercisePrimaryMuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExercisePrimaryMuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExercisePrimaryMuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExercisePrimaryMuscleGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExercisePrimaryMuscleGroups
    **/
    _count?: true | ExercisePrimaryMuscleGroupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExercisePrimaryMuscleGroupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExercisePrimaryMuscleGroupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExercisePrimaryMuscleGroupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExercisePrimaryMuscleGroupMaxAggregateInputType
  }

  export type GetExercisePrimaryMuscleGroupAggregateType<T extends ExercisePrimaryMuscleGroupAggregateArgs> = {
        [P in keyof T & keyof AggregateExercisePrimaryMuscleGroup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExercisePrimaryMuscleGroup[P]>
      : GetScalarType<T[P], AggregateExercisePrimaryMuscleGroup[P]>
  }




  export type ExercisePrimaryMuscleGroupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExercisePrimaryMuscleGroupWhereInput
    orderBy?: ExercisePrimaryMuscleGroupOrderByWithAggregationInput | ExercisePrimaryMuscleGroupOrderByWithAggregationInput[]
    by: ExercisePrimaryMuscleGroupScalarFieldEnum[] | ExercisePrimaryMuscleGroupScalarFieldEnum
    having?: ExercisePrimaryMuscleGroupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExercisePrimaryMuscleGroupCountAggregateInputType | true
    _avg?: ExercisePrimaryMuscleGroupAvgAggregateInputType
    _sum?: ExercisePrimaryMuscleGroupSumAggregateInputType
    _min?: ExercisePrimaryMuscleGroupMinAggregateInputType
    _max?: ExercisePrimaryMuscleGroupMaxAggregateInputType
  }

  export type ExercisePrimaryMuscleGroupGroupByOutputType = {
    exerciseId: number
    muscleGroupId: number
    _count: ExercisePrimaryMuscleGroupCountAggregateOutputType | null
    _avg: ExercisePrimaryMuscleGroupAvgAggregateOutputType | null
    _sum: ExercisePrimaryMuscleGroupSumAggregateOutputType | null
    _min: ExercisePrimaryMuscleGroupMinAggregateOutputType | null
    _max: ExercisePrimaryMuscleGroupMaxAggregateOutputType | null
  }

  type GetExercisePrimaryMuscleGroupGroupByPayload<T extends ExercisePrimaryMuscleGroupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExercisePrimaryMuscleGroupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExercisePrimaryMuscleGroupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExercisePrimaryMuscleGroupGroupByOutputType[P]>
            : GetScalarType<T[P], ExercisePrimaryMuscleGroupGroupByOutputType[P]>
        }
      >
    >


  export type ExercisePrimaryMuscleGroupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    exerciseId?: boolean
    muscleGroupId?: boolean
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exercisePrimaryMuscleGroup"]>

  export type ExercisePrimaryMuscleGroupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    exerciseId?: boolean
    muscleGroupId?: boolean
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exercisePrimaryMuscleGroup"]>

  export type ExercisePrimaryMuscleGroupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    exerciseId?: boolean
    muscleGroupId?: boolean
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exercisePrimaryMuscleGroup"]>

  export type ExercisePrimaryMuscleGroupSelectScalar = {
    exerciseId?: boolean
    muscleGroupId?: boolean
  }

  export type ExercisePrimaryMuscleGroupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"exerciseId" | "muscleGroupId", ExtArgs["result"]["exercisePrimaryMuscleGroup"]>
  export type ExercisePrimaryMuscleGroupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }
  export type ExercisePrimaryMuscleGroupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }
  export type ExercisePrimaryMuscleGroupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }

  export type $ExercisePrimaryMuscleGroupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExercisePrimaryMuscleGroup"
    objects: {
      exercise: Prisma.$ExercisePayload<ExtArgs>
      muscleGroup: Prisma.$MuscleGroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      exerciseId: number
      muscleGroupId: number
    }, ExtArgs["result"]["exercisePrimaryMuscleGroup"]>
    composites: {}
  }

  type ExercisePrimaryMuscleGroupGetPayload<S extends boolean | null | undefined | ExercisePrimaryMuscleGroupDefaultArgs> = $Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload, S>

  type ExercisePrimaryMuscleGroupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExercisePrimaryMuscleGroupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExercisePrimaryMuscleGroupCountAggregateInputType | true
    }

  export interface ExercisePrimaryMuscleGroupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExercisePrimaryMuscleGroup'], meta: { name: 'ExercisePrimaryMuscleGroup' } }
    /**
     * Find zero or one ExercisePrimaryMuscleGroup that matches the filter.
     * @param {ExercisePrimaryMuscleGroupFindUniqueArgs} args - Arguments to find a ExercisePrimaryMuscleGroup
     * @example
     * // Get one ExercisePrimaryMuscleGroup
     * const exercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExercisePrimaryMuscleGroupFindUniqueArgs>(args: SelectSubset<T, ExercisePrimaryMuscleGroupFindUniqueArgs<ExtArgs>>): Prisma__ExercisePrimaryMuscleGroupClient<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExercisePrimaryMuscleGroup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExercisePrimaryMuscleGroupFindUniqueOrThrowArgs} args - Arguments to find a ExercisePrimaryMuscleGroup
     * @example
     * // Get one ExercisePrimaryMuscleGroup
     * const exercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExercisePrimaryMuscleGroupFindUniqueOrThrowArgs>(args: SelectSubset<T, ExercisePrimaryMuscleGroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExercisePrimaryMuscleGroupClient<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExercisePrimaryMuscleGroup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExercisePrimaryMuscleGroupFindFirstArgs} args - Arguments to find a ExercisePrimaryMuscleGroup
     * @example
     * // Get one ExercisePrimaryMuscleGroup
     * const exercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExercisePrimaryMuscleGroupFindFirstArgs>(args?: SelectSubset<T, ExercisePrimaryMuscleGroupFindFirstArgs<ExtArgs>>): Prisma__ExercisePrimaryMuscleGroupClient<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExercisePrimaryMuscleGroup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExercisePrimaryMuscleGroupFindFirstOrThrowArgs} args - Arguments to find a ExercisePrimaryMuscleGroup
     * @example
     * // Get one ExercisePrimaryMuscleGroup
     * const exercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExercisePrimaryMuscleGroupFindFirstOrThrowArgs>(args?: SelectSubset<T, ExercisePrimaryMuscleGroupFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExercisePrimaryMuscleGroupClient<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExercisePrimaryMuscleGroups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExercisePrimaryMuscleGroupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExercisePrimaryMuscleGroups
     * const exercisePrimaryMuscleGroups = await prisma.exercisePrimaryMuscleGroup.findMany()
     * 
     * // Get first 10 ExercisePrimaryMuscleGroups
     * const exercisePrimaryMuscleGroups = await prisma.exercisePrimaryMuscleGroup.findMany({ take: 10 })
     * 
     * // Only select the `exerciseId`
     * const exercisePrimaryMuscleGroupWithExerciseIdOnly = await prisma.exercisePrimaryMuscleGroup.findMany({ select: { exerciseId: true } })
     * 
     */
    findMany<T extends ExercisePrimaryMuscleGroupFindManyArgs>(args?: SelectSubset<T, ExercisePrimaryMuscleGroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExercisePrimaryMuscleGroup.
     * @param {ExercisePrimaryMuscleGroupCreateArgs} args - Arguments to create a ExercisePrimaryMuscleGroup.
     * @example
     * // Create one ExercisePrimaryMuscleGroup
     * const ExercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.create({
     *   data: {
     *     // ... data to create a ExercisePrimaryMuscleGroup
     *   }
     * })
     * 
     */
    create<T extends ExercisePrimaryMuscleGroupCreateArgs>(args: SelectSubset<T, ExercisePrimaryMuscleGroupCreateArgs<ExtArgs>>): Prisma__ExercisePrimaryMuscleGroupClient<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExercisePrimaryMuscleGroups.
     * @param {ExercisePrimaryMuscleGroupCreateManyArgs} args - Arguments to create many ExercisePrimaryMuscleGroups.
     * @example
     * // Create many ExercisePrimaryMuscleGroups
     * const exercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExercisePrimaryMuscleGroupCreateManyArgs>(args?: SelectSubset<T, ExercisePrimaryMuscleGroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExercisePrimaryMuscleGroups and returns the data saved in the database.
     * @param {ExercisePrimaryMuscleGroupCreateManyAndReturnArgs} args - Arguments to create many ExercisePrimaryMuscleGroups.
     * @example
     * // Create many ExercisePrimaryMuscleGroups
     * const exercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExercisePrimaryMuscleGroups and only return the `exerciseId`
     * const exercisePrimaryMuscleGroupWithExerciseIdOnly = await prisma.exercisePrimaryMuscleGroup.createManyAndReturn({
     *   select: { exerciseId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExercisePrimaryMuscleGroupCreateManyAndReturnArgs>(args?: SelectSubset<T, ExercisePrimaryMuscleGroupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExercisePrimaryMuscleGroup.
     * @param {ExercisePrimaryMuscleGroupDeleteArgs} args - Arguments to delete one ExercisePrimaryMuscleGroup.
     * @example
     * // Delete one ExercisePrimaryMuscleGroup
     * const ExercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.delete({
     *   where: {
     *     // ... filter to delete one ExercisePrimaryMuscleGroup
     *   }
     * })
     * 
     */
    delete<T extends ExercisePrimaryMuscleGroupDeleteArgs>(args: SelectSubset<T, ExercisePrimaryMuscleGroupDeleteArgs<ExtArgs>>): Prisma__ExercisePrimaryMuscleGroupClient<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExercisePrimaryMuscleGroup.
     * @param {ExercisePrimaryMuscleGroupUpdateArgs} args - Arguments to update one ExercisePrimaryMuscleGroup.
     * @example
     * // Update one ExercisePrimaryMuscleGroup
     * const exercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExercisePrimaryMuscleGroupUpdateArgs>(args: SelectSubset<T, ExercisePrimaryMuscleGroupUpdateArgs<ExtArgs>>): Prisma__ExercisePrimaryMuscleGroupClient<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExercisePrimaryMuscleGroups.
     * @param {ExercisePrimaryMuscleGroupDeleteManyArgs} args - Arguments to filter ExercisePrimaryMuscleGroups to delete.
     * @example
     * // Delete a few ExercisePrimaryMuscleGroups
     * const { count } = await prisma.exercisePrimaryMuscleGroup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExercisePrimaryMuscleGroupDeleteManyArgs>(args?: SelectSubset<T, ExercisePrimaryMuscleGroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExercisePrimaryMuscleGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExercisePrimaryMuscleGroupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExercisePrimaryMuscleGroups
     * const exercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExercisePrimaryMuscleGroupUpdateManyArgs>(args: SelectSubset<T, ExercisePrimaryMuscleGroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExercisePrimaryMuscleGroups and returns the data updated in the database.
     * @param {ExercisePrimaryMuscleGroupUpdateManyAndReturnArgs} args - Arguments to update many ExercisePrimaryMuscleGroups.
     * @example
     * // Update many ExercisePrimaryMuscleGroups
     * const exercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExercisePrimaryMuscleGroups and only return the `exerciseId`
     * const exercisePrimaryMuscleGroupWithExerciseIdOnly = await prisma.exercisePrimaryMuscleGroup.updateManyAndReturn({
     *   select: { exerciseId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExercisePrimaryMuscleGroupUpdateManyAndReturnArgs>(args: SelectSubset<T, ExercisePrimaryMuscleGroupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExercisePrimaryMuscleGroup.
     * @param {ExercisePrimaryMuscleGroupUpsertArgs} args - Arguments to update or create a ExercisePrimaryMuscleGroup.
     * @example
     * // Update or create a ExercisePrimaryMuscleGroup
     * const exercisePrimaryMuscleGroup = await prisma.exercisePrimaryMuscleGroup.upsert({
     *   create: {
     *     // ... data to create a ExercisePrimaryMuscleGroup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExercisePrimaryMuscleGroup we want to update
     *   }
     * })
     */
    upsert<T extends ExercisePrimaryMuscleGroupUpsertArgs>(args: SelectSubset<T, ExercisePrimaryMuscleGroupUpsertArgs<ExtArgs>>): Prisma__ExercisePrimaryMuscleGroupClient<$Result.GetResult<Prisma.$ExercisePrimaryMuscleGroupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExercisePrimaryMuscleGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExercisePrimaryMuscleGroupCountArgs} args - Arguments to filter ExercisePrimaryMuscleGroups to count.
     * @example
     * // Count the number of ExercisePrimaryMuscleGroups
     * const count = await prisma.exercisePrimaryMuscleGroup.count({
     *   where: {
     *     // ... the filter for the ExercisePrimaryMuscleGroups we want to count
     *   }
     * })
    **/
    count<T extends ExercisePrimaryMuscleGroupCountArgs>(
      args?: Subset<T, ExercisePrimaryMuscleGroupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExercisePrimaryMuscleGroupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExercisePrimaryMuscleGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExercisePrimaryMuscleGroupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExercisePrimaryMuscleGroupAggregateArgs>(args: Subset<T, ExercisePrimaryMuscleGroupAggregateArgs>): Prisma.PrismaPromise<GetExercisePrimaryMuscleGroupAggregateType<T>>

    /**
     * Group by ExercisePrimaryMuscleGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExercisePrimaryMuscleGroupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExercisePrimaryMuscleGroupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExercisePrimaryMuscleGroupGroupByArgs['orderBy'] }
        : { orderBy?: ExercisePrimaryMuscleGroupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExercisePrimaryMuscleGroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExercisePrimaryMuscleGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExercisePrimaryMuscleGroup model
   */
  readonly fields: ExercisePrimaryMuscleGroupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExercisePrimaryMuscleGroup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExercisePrimaryMuscleGroupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    exercise<T extends ExerciseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExerciseDefaultArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    muscleGroup<T extends MuscleGroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MuscleGroupDefaultArgs<ExtArgs>>): Prisma__MuscleGroupClient<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExercisePrimaryMuscleGroup model
   */
  interface ExercisePrimaryMuscleGroupFieldRefs {
    readonly exerciseId: FieldRef<"ExercisePrimaryMuscleGroup", 'Int'>
    readonly muscleGroupId: FieldRef<"ExercisePrimaryMuscleGroup", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ExercisePrimaryMuscleGroup findUnique
   */
  export type ExercisePrimaryMuscleGroupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which ExercisePrimaryMuscleGroup to fetch.
     */
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
  }

  /**
   * ExercisePrimaryMuscleGroup findUniqueOrThrow
   */
  export type ExercisePrimaryMuscleGroupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which ExercisePrimaryMuscleGroup to fetch.
     */
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
  }

  /**
   * ExercisePrimaryMuscleGroup findFirst
   */
  export type ExercisePrimaryMuscleGroupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which ExercisePrimaryMuscleGroup to fetch.
     */
    where?: ExercisePrimaryMuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExercisePrimaryMuscleGroups to fetch.
     */
    orderBy?: ExercisePrimaryMuscleGroupOrderByWithRelationInput | ExercisePrimaryMuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExercisePrimaryMuscleGroups.
     */
    cursor?: ExercisePrimaryMuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExercisePrimaryMuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExercisePrimaryMuscleGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExercisePrimaryMuscleGroups.
     */
    distinct?: ExercisePrimaryMuscleGroupScalarFieldEnum | ExercisePrimaryMuscleGroupScalarFieldEnum[]
  }

  /**
   * ExercisePrimaryMuscleGroup findFirstOrThrow
   */
  export type ExercisePrimaryMuscleGroupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which ExercisePrimaryMuscleGroup to fetch.
     */
    where?: ExercisePrimaryMuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExercisePrimaryMuscleGroups to fetch.
     */
    orderBy?: ExercisePrimaryMuscleGroupOrderByWithRelationInput | ExercisePrimaryMuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExercisePrimaryMuscleGroups.
     */
    cursor?: ExercisePrimaryMuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExercisePrimaryMuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExercisePrimaryMuscleGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExercisePrimaryMuscleGroups.
     */
    distinct?: ExercisePrimaryMuscleGroupScalarFieldEnum | ExercisePrimaryMuscleGroupScalarFieldEnum[]
  }

  /**
   * ExercisePrimaryMuscleGroup findMany
   */
  export type ExercisePrimaryMuscleGroupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which ExercisePrimaryMuscleGroups to fetch.
     */
    where?: ExercisePrimaryMuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExercisePrimaryMuscleGroups to fetch.
     */
    orderBy?: ExercisePrimaryMuscleGroupOrderByWithRelationInput | ExercisePrimaryMuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExercisePrimaryMuscleGroups.
     */
    cursor?: ExercisePrimaryMuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExercisePrimaryMuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExercisePrimaryMuscleGroups.
     */
    skip?: number
    distinct?: ExercisePrimaryMuscleGroupScalarFieldEnum | ExercisePrimaryMuscleGroupScalarFieldEnum[]
  }

  /**
   * ExercisePrimaryMuscleGroup create
   */
  export type ExercisePrimaryMuscleGroupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    /**
     * The data needed to create a ExercisePrimaryMuscleGroup.
     */
    data: XOR<ExercisePrimaryMuscleGroupCreateInput, ExercisePrimaryMuscleGroupUncheckedCreateInput>
  }

  /**
   * ExercisePrimaryMuscleGroup createMany
   */
  export type ExercisePrimaryMuscleGroupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExercisePrimaryMuscleGroups.
     */
    data: ExercisePrimaryMuscleGroupCreateManyInput | ExercisePrimaryMuscleGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExercisePrimaryMuscleGroup createManyAndReturn
   */
  export type ExercisePrimaryMuscleGroupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * The data used to create many ExercisePrimaryMuscleGroups.
     */
    data: ExercisePrimaryMuscleGroupCreateManyInput | ExercisePrimaryMuscleGroupCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExercisePrimaryMuscleGroup update
   */
  export type ExercisePrimaryMuscleGroupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    /**
     * The data needed to update a ExercisePrimaryMuscleGroup.
     */
    data: XOR<ExercisePrimaryMuscleGroupUpdateInput, ExercisePrimaryMuscleGroupUncheckedUpdateInput>
    /**
     * Choose, which ExercisePrimaryMuscleGroup to update.
     */
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
  }

  /**
   * ExercisePrimaryMuscleGroup updateMany
   */
  export type ExercisePrimaryMuscleGroupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExercisePrimaryMuscleGroups.
     */
    data: XOR<ExercisePrimaryMuscleGroupUpdateManyMutationInput, ExercisePrimaryMuscleGroupUncheckedUpdateManyInput>
    /**
     * Filter which ExercisePrimaryMuscleGroups to update
     */
    where?: ExercisePrimaryMuscleGroupWhereInput
    /**
     * Limit how many ExercisePrimaryMuscleGroups to update.
     */
    limit?: number
  }

  /**
   * ExercisePrimaryMuscleGroup updateManyAndReturn
   */
  export type ExercisePrimaryMuscleGroupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * The data used to update ExercisePrimaryMuscleGroups.
     */
    data: XOR<ExercisePrimaryMuscleGroupUpdateManyMutationInput, ExercisePrimaryMuscleGroupUncheckedUpdateManyInput>
    /**
     * Filter which ExercisePrimaryMuscleGroups to update
     */
    where?: ExercisePrimaryMuscleGroupWhereInput
    /**
     * Limit how many ExercisePrimaryMuscleGroups to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExercisePrimaryMuscleGroup upsert
   */
  export type ExercisePrimaryMuscleGroupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    /**
     * The filter to search for the ExercisePrimaryMuscleGroup to update in case it exists.
     */
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
    /**
     * In case the ExercisePrimaryMuscleGroup found by the `where` argument doesn't exist, create a new ExercisePrimaryMuscleGroup with this data.
     */
    create: XOR<ExercisePrimaryMuscleGroupCreateInput, ExercisePrimaryMuscleGroupUncheckedCreateInput>
    /**
     * In case the ExercisePrimaryMuscleGroup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExercisePrimaryMuscleGroupUpdateInput, ExercisePrimaryMuscleGroupUncheckedUpdateInput>
  }

  /**
   * ExercisePrimaryMuscleGroup delete
   */
  export type ExercisePrimaryMuscleGroupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter which ExercisePrimaryMuscleGroup to delete.
     */
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
  }

  /**
   * ExercisePrimaryMuscleGroup deleteMany
   */
  export type ExercisePrimaryMuscleGroupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExercisePrimaryMuscleGroups to delete
     */
    where?: ExercisePrimaryMuscleGroupWhereInput
    /**
     * Limit how many ExercisePrimaryMuscleGroups to delete.
     */
    limit?: number
  }

  /**
   * ExercisePrimaryMuscleGroup without action
   */
  export type ExercisePrimaryMuscleGroupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExercisePrimaryMuscleGroup
     */
    select?: ExercisePrimaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExercisePrimaryMuscleGroup
     */
    omit?: ExercisePrimaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExercisePrimaryMuscleGroupInclude<ExtArgs> | null
  }


  /**
   * Model ExerciseSecondaryMuscleGroup
   */

  export type AggregateExerciseSecondaryMuscleGroup = {
    _count: ExerciseSecondaryMuscleGroupCountAggregateOutputType | null
    _avg: ExerciseSecondaryMuscleGroupAvgAggregateOutputType | null
    _sum: ExerciseSecondaryMuscleGroupSumAggregateOutputType | null
    _min: ExerciseSecondaryMuscleGroupMinAggregateOutputType | null
    _max: ExerciseSecondaryMuscleGroupMaxAggregateOutputType | null
  }

  export type ExerciseSecondaryMuscleGroupAvgAggregateOutputType = {
    exerciseId: number | null
    muscleGroupId: number | null
  }

  export type ExerciseSecondaryMuscleGroupSumAggregateOutputType = {
    exerciseId: number | null
    muscleGroupId: number | null
  }

  export type ExerciseSecondaryMuscleGroupMinAggregateOutputType = {
    exerciseId: number | null
    muscleGroupId: number | null
  }

  export type ExerciseSecondaryMuscleGroupMaxAggregateOutputType = {
    exerciseId: number | null
    muscleGroupId: number | null
  }

  export type ExerciseSecondaryMuscleGroupCountAggregateOutputType = {
    exerciseId: number
    muscleGroupId: number
    _all: number
  }


  export type ExerciseSecondaryMuscleGroupAvgAggregateInputType = {
    exerciseId?: true
    muscleGroupId?: true
  }

  export type ExerciseSecondaryMuscleGroupSumAggregateInputType = {
    exerciseId?: true
    muscleGroupId?: true
  }

  export type ExerciseSecondaryMuscleGroupMinAggregateInputType = {
    exerciseId?: true
    muscleGroupId?: true
  }

  export type ExerciseSecondaryMuscleGroupMaxAggregateInputType = {
    exerciseId?: true
    muscleGroupId?: true
  }

  export type ExerciseSecondaryMuscleGroupCountAggregateInputType = {
    exerciseId?: true
    muscleGroupId?: true
    _all?: true
  }

  export type ExerciseSecondaryMuscleGroupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExerciseSecondaryMuscleGroup to aggregate.
     */
    where?: ExerciseSecondaryMuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseSecondaryMuscleGroups to fetch.
     */
    orderBy?: ExerciseSecondaryMuscleGroupOrderByWithRelationInput | ExerciseSecondaryMuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExerciseSecondaryMuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseSecondaryMuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseSecondaryMuscleGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExerciseSecondaryMuscleGroups
    **/
    _count?: true | ExerciseSecondaryMuscleGroupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExerciseSecondaryMuscleGroupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExerciseSecondaryMuscleGroupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExerciseSecondaryMuscleGroupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExerciseSecondaryMuscleGroupMaxAggregateInputType
  }

  export type GetExerciseSecondaryMuscleGroupAggregateType<T extends ExerciseSecondaryMuscleGroupAggregateArgs> = {
        [P in keyof T & keyof AggregateExerciseSecondaryMuscleGroup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExerciseSecondaryMuscleGroup[P]>
      : GetScalarType<T[P], AggregateExerciseSecondaryMuscleGroup[P]>
  }




  export type ExerciseSecondaryMuscleGroupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseSecondaryMuscleGroupWhereInput
    orderBy?: ExerciseSecondaryMuscleGroupOrderByWithAggregationInput | ExerciseSecondaryMuscleGroupOrderByWithAggregationInput[]
    by: ExerciseSecondaryMuscleGroupScalarFieldEnum[] | ExerciseSecondaryMuscleGroupScalarFieldEnum
    having?: ExerciseSecondaryMuscleGroupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExerciseSecondaryMuscleGroupCountAggregateInputType | true
    _avg?: ExerciseSecondaryMuscleGroupAvgAggregateInputType
    _sum?: ExerciseSecondaryMuscleGroupSumAggregateInputType
    _min?: ExerciseSecondaryMuscleGroupMinAggregateInputType
    _max?: ExerciseSecondaryMuscleGroupMaxAggregateInputType
  }

  export type ExerciseSecondaryMuscleGroupGroupByOutputType = {
    exerciseId: number
    muscleGroupId: number
    _count: ExerciseSecondaryMuscleGroupCountAggregateOutputType | null
    _avg: ExerciseSecondaryMuscleGroupAvgAggregateOutputType | null
    _sum: ExerciseSecondaryMuscleGroupSumAggregateOutputType | null
    _min: ExerciseSecondaryMuscleGroupMinAggregateOutputType | null
    _max: ExerciseSecondaryMuscleGroupMaxAggregateOutputType | null
  }

  type GetExerciseSecondaryMuscleGroupGroupByPayload<T extends ExerciseSecondaryMuscleGroupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExerciseSecondaryMuscleGroupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExerciseSecondaryMuscleGroupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExerciseSecondaryMuscleGroupGroupByOutputType[P]>
            : GetScalarType<T[P], ExerciseSecondaryMuscleGroupGroupByOutputType[P]>
        }
      >
    >


  export type ExerciseSecondaryMuscleGroupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    exerciseId?: boolean
    muscleGroupId?: boolean
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exerciseSecondaryMuscleGroup"]>

  export type ExerciseSecondaryMuscleGroupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    exerciseId?: boolean
    muscleGroupId?: boolean
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exerciseSecondaryMuscleGroup"]>

  export type ExerciseSecondaryMuscleGroupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    exerciseId?: boolean
    muscleGroupId?: boolean
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exerciseSecondaryMuscleGroup"]>

  export type ExerciseSecondaryMuscleGroupSelectScalar = {
    exerciseId?: boolean
    muscleGroupId?: boolean
  }

  export type ExerciseSecondaryMuscleGroupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"exerciseId" | "muscleGroupId", ExtArgs["result"]["exerciseSecondaryMuscleGroup"]>
  export type ExerciseSecondaryMuscleGroupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }
  export type ExerciseSecondaryMuscleGroupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }
  export type ExerciseSecondaryMuscleGroupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    muscleGroup?: boolean | MuscleGroupDefaultArgs<ExtArgs>
  }

  export type $ExerciseSecondaryMuscleGroupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExerciseSecondaryMuscleGroup"
    objects: {
      exercise: Prisma.$ExercisePayload<ExtArgs>
      muscleGroup: Prisma.$MuscleGroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      exerciseId: number
      muscleGroupId: number
    }, ExtArgs["result"]["exerciseSecondaryMuscleGroup"]>
    composites: {}
  }

  type ExerciseSecondaryMuscleGroupGetPayload<S extends boolean | null | undefined | ExerciseSecondaryMuscleGroupDefaultArgs> = $Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload, S>

  type ExerciseSecondaryMuscleGroupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExerciseSecondaryMuscleGroupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExerciseSecondaryMuscleGroupCountAggregateInputType | true
    }

  export interface ExerciseSecondaryMuscleGroupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExerciseSecondaryMuscleGroup'], meta: { name: 'ExerciseSecondaryMuscleGroup' } }
    /**
     * Find zero or one ExerciseSecondaryMuscleGroup that matches the filter.
     * @param {ExerciseSecondaryMuscleGroupFindUniqueArgs} args - Arguments to find a ExerciseSecondaryMuscleGroup
     * @example
     * // Get one ExerciseSecondaryMuscleGroup
     * const exerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExerciseSecondaryMuscleGroupFindUniqueArgs>(args: SelectSubset<T, ExerciseSecondaryMuscleGroupFindUniqueArgs<ExtArgs>>): Prisma__ExerciseSecondaryMuscleGroupClient<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExerciseSecondaryMuscleGroup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExerciseSecondaryMuscleGroupFindUniqueOrThrowArgs} args - Arguments to find a ExerciseSecondaryMuscleGroup
     * @example
     * // Get one ExerciseSecondaryMuscleGroup
     * const exerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExerciseSecondaryMuscleGroupFindUniqueOrThrowArgs>(args: SelectSubset<T, ExerciseSecondaryMuscleGroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExerciseSecondaryMuscleGroupClient<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExerciseSecondaryMuscleGroup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseSecondaryMuscleGroupFindFirstArgs} args - Arguments to find a ExerciseSecondaryMuscleGroup
     * @example
     * // Get one ExerciseSecondaryMuscleGroup
     * const exerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExerciseSecondaryMuscleGroupFindFirstArgs>(args?: SelectSubset<T, ExerciseSecondaryMuscleGroupFindFirstArgs<ExtArgs>>): Prisma__ExerciseSecondaryMuscleGroupClient<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExerciseSecondaryMuscleGroup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseSecondaryMuscleGroupFindFirstOrThrowArgs} args - Arguments to find a ExerciseSecondaryMuscleGroup
     * @example
     * // Get one ExerciseSecondaryMuscleGroup
     * const exerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExerciseSecondaryMuscleGroupFindFirstOrThrowArgs>(args?: SelectSubset<T, ExerciseSecondaryMuscleGroupFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExerciseSecondaryMuscleGroupClient<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExerciseSecondaryMuscleGroups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseSecondaryMuscleGroupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExerciseSecondaryMuscleGroups
     * const exerciseSecondaryMuscleGroups = await prisma.exerciseSecondaryMuscleGroup.findMany()
     * 
     * // Get first 10 ExerciseSecondaryMuscleGroups
     * const exerciseSecondaryMuscleGroups = await prisma.exerciseSecondaryMuscleGroup.findMany({ take: 10 })
     * 
     * // Only select the `exerciseId`
     * const exerciseSecondaryMuscleGroupWithExerciseIdOnly = await prisma.exerciseSecondaryMuscleGroup.findMany({ select: { exerciseId: true } })
     * 
     */
    findMany<T extends ExerciseSecondaryMuscleGroupFindManyArgs>(args?: SelectSubset<T, ExerciseSecondaryMuscleGroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExerciseSecondaryMuscleGroup.
     * @param {ExerciseSecondaryMuscleGroupCreateArgs} args - Arguments to create a ExerciseSecondaryMuscleGroup.
     * @example
     * // Create one ExerciseSecondaryMuscleGroup
     * const ExerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.create({
     *   data: {
     *     // ... data to create a ExerciseSecondaryMuscleGroup
     *   }
     * })
     * 
     */
    create<T extends ExerciseSecondaryMuscleGroupCreateArgs>(args: SelectSubset<T, ExerciseSecondaryMuscleGroupCreateArgs<ExtArgs>>): Prisma__ExerciseSecondaryMuscleGroupClient<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExerciseSecondaryMuscleGroups.
     * @param {ExerciseSecondaryMuscleGroupCreateManyArgs} args - Arguments to create many ExerciseSecondaryMuscleGroups.
     * @example
     * // Create many ExerciseSecondaryMuscleGroups
     * const exerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExerciseSecondaryMuscleGroupCreateManyArgs>(args?: SelectSubset<T, ExerciseSecondaryMuscleGroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExerciseSecondaryMuscleGroups and returns the data saved in the database.
     * @param {ExerciseSecondaryMuscleGroupCreateManyAndReturnArgs} args - Arguments to create many ExerciseSecondaryMuscleGroups.
     * @example
     * // Create many ExerciseSecondaryMuscleGroups
     * const exerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExerciseSecondaryMuscleGroups and only return the `exerciseId`
     * const exerciseSecondaryMuscleGroupWithExerciseIdOnly = await prisma.exerciseSecondaryMuscleGroup.createManyAndReturn({
     *   select: { exerciseId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExerciseSecondaryMuscleGroupCreateManyAndReturnArgs>(args?: SelectSubset<T, ExerciseSecondaryMuscleGroupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExerciseSecondaryMuscleGroup.
     * @param {ExerciseSecondaryMuscleGroupDeleteArgs} args - Arguments to delete one ExerciseSecondaryMuscleGroup.
     * @example
     * // Delete one ExerciseSecondaryMuscleGroup
     * const ExerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.delete({
     *   where: {
     *     // ... filter to delete one ExerciseSecondaryMuscleGroup
     *   }
     * })
     * 
     */
    delete<T extends ExerciseSecondaryMuscleGroupDeleteArgs>(args: SelectSubset<T, ExerciseSecondaryMuscleGroupDeleteArgs<ExtArgs>>): Prisma__ExerciseSecondaryMuscleGroupClient<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExerciseSecondaryMuscleGroup.
     * @param {ExerciseSecondaryMuscleGroupUpdateArgs} args - Arguments to update one ExerciseSecondaryMuscleGroup.
     * @example
     * // Update one ExerciseSecondaryMuscleGroup
     * const exerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExerciseSecondaryMuscleGroupUpdateArgs>(args: SelectSubset<T, ExerciseSecondaryMuscleGroupUpdateArgs<ExtArgs>>): Prisma__ExerciseSecondaryMuscleGroupClient<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExerciseSecondaryMuscleGroups.
     * @param {ExerciseSecondaryMuscleGroupDeleteManyArgs} args - Arguments to filter ExerciseSecondaryMuscleGroups to delete.
     * @example
     * // Delete a few ExerciseSecondaryMuscleGroups
     * const { count } = await prisma.exerciseSecondaryMuscleGroup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExerciseSecondaryMuscleGroupDeleteManyArgs>(args?: SelectSubset<T, ExerciseSecondaryMuscleGroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExerciseSecondaryMuscleGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseSecondaryMuscleGroupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExerciseSecondaryMuscleGroups
     * const exerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExerciseSecondaryMuscleGroupUpdateManyArgs>(args: SelectSubset<T, ExerciseSecondaryMuscleGroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExerciseSecondaryMuscleGroups and returns the data updated in the database.
     * @param {ExerciseSecondaryMuscleGroupUpdateManyAndReturnArgs} args - Arguments to update many ExerciseSecondaryMuscleGroups.
     * @example
     * // Update many ExerciseSecondaryMuscleGroups
     * const exerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExerciseSecondaryMuscleGroups and only return the `exerciseId`
     * const exerciseSecondaryMuscleGroupWithExerciseIdOnly = await prisma.exerciseSecondaryMuscleGroup.updateManyAndReturn({
     *   select: { exerciseId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExerciseSecondaryMuscleGroupUpdateManyAndReturnArgs>(args: SelectSubset<T, ExerciseSecondaryMuscleGroupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExerciseSecondaryMuscleGroup.
     * @param {ExerciseSecondaryMuscleGroupUpsertArgs} args - Arguments to update or create a ExerciseSecondaryMuscleGroup.
     * @example
     * // Update or create a ExerciseSecondaryMuscleGroup
     * const exerciseSecondaryMuscleGroup = await prisma.exerciseSecondaryMuscleGroup.upsert({
     *   create: {
     *     // ... data to create a ExerciseSecondaryMuscleGroup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExerciseSecondaryMuscleGroup we want to update
     *   }
     * })
     */
    upsert<T extends ExerciseSecondaryMuscleGroupUpsertArgs>(args: SelectSubset<T, ExerciseSecondaryMuscleGroupUpsertArgs<ExtArgs>>): Prisma__ExerciseSecondaryMuscleGroupClient<$Result.GetResult<Prisma.$ExerciseSecondaryMuscleGroupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExerciseSecondaryMuscleGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseSecondaryMuscleGroupCountArgs} args - Arguments to filter ExerciseSecondaryMuscleGroups to count.
     * @example
     * // Count the number of ExerciseSecondaryMuscleGroups
     * const count = await prisma.exerciseSecondaryMuscleGroup.count({
     *   where: {
     *     // ... the filter for the ExerciseSecondaryMuscleGroups we want to count
     *   }
     * })
    **/
    count<T extends ExerciseSecondaryMuscleGroupCountArgs>(
      args?: Subset<T, ExerciseSecondaryMuscleGroupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExerciseSecondaryMuscleGroupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExerciseSecondaryMuscleGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseSecondaryMuscleGroupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExerciseSecondaryMuscleGroupAggregateArgs>(args: Subset<T, ExerciseSecondaryMuscleGroupAggregateArgs>): Prisma.PrismaPromise<GetExerciseSecondaryMuscleGroupAggregateType<T>>

    /**
     * Group by ExerciseSecondaryMuscleGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseSecondaryMuscleGroupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExerciseSecondaryMuscleGroupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExerciseSecondaryMuscleGroupGroupByArgs['orderBy'] }
        : { orderBy?: ExerciseSecondaryMuscleGroupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExerciseSecondaryMuscleGroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExerciseSecondaryMuscleGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExerciseSecondaryMuscleGroup model
   */
  readonly fields: ExerciseSecondaryMuscleGroupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExerciseSecondaryMuscleGroup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExerciseSecondaryMuscleGroupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    exercise<T extends ExerciseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExerciseDefaultArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    muscleGroup<T extends MuscleGroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MuscleGroupDefaultArgs<ExtArgs>>): Prisma__MuscleGroupClient<$Result.GetResult<Prisma.$MuscleGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExerciseSecondaryMuscleGroup model
   */
  interface ExerciseSecondaryMuscleGroupFieldRefs {
    readonly exerciseId: FieldRef<"ExerciseSecondaryMuscleGroup", 'Int'>
    readonly muscleGroupId: FieldRef<"ExerciseSecondaryMuscleGroup", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ExerciseSecondaryMuscleGroup findUnique
   */
  export type ExerciseSecondaryMuscleGroupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseSecondaryMuscleGroup to fetch.
     */
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
  }

  /**
   * ExerciseSecondaryMuscleGroup findUniqueOrThrow
   */
  export type ExerciseSecondaryMuscleGroupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseSecondaryMuscleGroup to fetch.
     */
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
  }

  /**
   * ExerciseSecondaryMuscleGroup findFirst
   */
  export type ExerciseSecondaryMuscleGroupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseSecondaryMuscleGroup to fetch.
     */
    where?: ExerciseSecondaryMuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseSecondaryMuscleGroups to fetch.
     */
    orderBy?: ExerciseSecondaryMuscleGroupOrderByWithRelationInput | ExerciseSecondaryMuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExerciseSecondaryMuscleGroups.
     */
    cursor?: ExerciseSecondaryMuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseSecondaryMuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseSecondaryMuscleGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExerciseSecondaryMuscleGroups.
     */
    distinct?: ExerciseSecondaryMuscleGroupScalarFieldEnum | ExerciseSecondaryMuscleGroupScalarFieldEnum[]
  }

  /**
   * ExerciseSecondaryMuscleGroup findFirstOrThrow
   */
  export type ExerciseSecondaryMuscleGroupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseSecondaryMuscleGroup to fetch.
     */
    where?: ExerciseSecondaryMuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseSecondaryMuscleGroups to fetch.
     */
    orderBy?: ExerciseSecondaryMuscleGroupOrderByWithRelationInput | ExerciseSecondaryMuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExerciseSecondaryMuscleGroups.
     */
    cursor?: ExerciseSecondaryMuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseSecondaryMuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseSecondaryMuscleGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExerciseSecondaryMuscleGroups.
     */
    distinct?: ExerciseSecondaryMuscleGroupScalarFieldEnum | ExerciseSecondaryMuscleGroupScalarFieldEnum[]
  }

  /**
   * ExerciseSecondaryMuscleGroup findMany
   */
  export type ExerciseSecondaryMuscleGroupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseSecondaryMuscleGroups to fetch.
     */
    where?: ExerciseSecondaryMuscleGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseSecondaryMuscleGroups to fetch.
     */
    orderBy?: ExerciseSecondaryMuscleGroupOrderByWithRelationInput | ExerciseSecondaryMuscleGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExerciseSecondaryMuscleGroups.
     */
    cursor?: ExerciseSecondaryMuscleGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseSecondaryMuscleGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseSecondaryMuscleGroups.
     */
    skip?: number
    distinct?: ExerciseSecondaryMuscleGroupScalarFieldEnum | ExerciseSecondaryMuscleGroupScalarFieldEnum[]
  }

  /**
   * ExerciseSecondaryMuscleGroup create
   */
  export type ExerciseSecondaryMuscleGroupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    /**
     * The data needed to create a ExerciseSecondaryMuscleGroup.
     */
    data: XOR<ExerciseSecondaryMuscleGroupCreateInput, ExerciseSecondaryMuscleGroupUncheckedCreateInput>
  }

  /**
   * ExerciseSecondaryMuscleGroup createMany
   */
  export type ExerciseSecondaryMuscleGroupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExerciseSecondaryMuscleGroups.
     */
    data: ExerciseSecondaryMuscleGroupCreateManyInput | ExerciseSecondaryMuscleGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExerciseSecondaryMuscleGroup createManyAndReturn
   */
  export type ExerciseSecondaryMuscleGroupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * The data used to create many ExerciseSecondaryMuscleGroups.
     */
    data: ExerciseSecondaryMuscleGroupCreateManyInput | ExerciseSecondaryMuscleGroupCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExerciseSecondaryMuscleGroup update
   */
  export type ExerciseSecondaryMuscleGroupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    /**
     * The data needed to update a ExerciseSecondaryMuscleGroup.
     */
    data: XOR<ExerciseSecondaryMuscleGroupUpdateInput, ExerciseSecondaryMuscleGroupUncheckedUpdateInput>
    /**
     * Choose, which ExerciseSecondaryMuscleGroup to update.
     */
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
  }

  /**
   * ExerciseSecondaryMuscleGroup updateMany
   */
  export type ExerciseSecondaryMuscleGroupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExerciseSecondaryMuscleGroups.
     */
    data: XOR<ExerciseSecondaryMuscleGroupUpdateManyMutationInput, ExerciseSecondaryMuscleGroupUncheckedUpdateManyInput>
    /**
     * Filter which ExerciseSecondaryMuscleGroups to update
     */
    where?: ExerciseSecondaryMuscleGroupWhereInput
    /**
     * Limit how many ExerciseSecondaryMuscleGroups to update.
     */
    limit?: number
  }

  /**
   * ExerciseSecondaryMuscleGroup updateManyAndReturn
   */
  export type ExerciseSecondaryMuscleGroupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * The data used to update ExerciseSecondaryMuscleGroups.
     */
    data: XOR<ExerciseSecondaryMuscleGroupUpdateManyMutationInput, ExerciseSecondaryMuscleGroupUncheckedUpdateManyInput>
    /**
     * Filter which ExerciseSecondaryMuscleGroups to update
     */
    where?: ExerciseSecondaryMuscleGroupWhereInput
    /**
     * Limit how many ExerciseSecondaryMuscleGroups to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExerciseSecondaryMuscleGroup upsert
   */
  export type ExerciseSecondaryMuscleGroupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    /**
     * The filter to search for the ExerciseSecondaryMuscleGroup to update in case it exists.
     */
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
    /**
     * In case the ExerciseSecondaryMuscleGroup found by the `where` argument doesn't exist, create a new ExerciseSecondaryMuscleGroup with this data.
     */
    create: XOR<ExerciseSecondaryMuscleGroupCreateInput, ExerciseSecondaryMuscleGroupUncheckedCreateInput>
    /**
     * In case the ExerciseSecondaryMuscleGroup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExerciseSecondaryMuscleGroupUpdateInput, ExerciseSecondaryMuscleGroupUncheckedUpdateInput>
  }

  /**
   * ExerciseSecondaryMuscleGroup delete
   */
  export type ExerciseSecondaryMuscleGroupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
    /**
     * Filter which ExerciseSecondaryMuscleGroup to delete.
     */
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
  }

  /**
   * ExerciseSecondaryMuscleGroup deleteMany
   */
  export type ExerciseSecondaryMuscleGroupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExerciseSecondaryMuscleGroups to delete
     */
    where?: ExerciseSecondaryMuscleGroupWhereInput
    /**
     * Limit how many ExerciseSecondaryMuscleGroups to delete.
     */
    limit?: number
  }

  /**
   * ExerciseSecondaryMuscleGroup without action
   */
  export type ExerciseSecondaryMuscleGroupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseSecondaryMuscleGroup
     */
    select?: ExerciseSecondaryMuscleGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseSecondaryMuscleGroup
     */
    omit?: ExerciseSecondaryMuscleGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseSecondaryMuscleGroupInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    googleId: string | null
    email: string | null
    name: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    googleId: string | null
    email: string | null
    name: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    googleId: number
    email: number
    name: number
    createdAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    googleId?: true
    email?: true
    name?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    googleId?: true
    email?: true
    name?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    googleId?: true
    email?: true
    name?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    googleId: string
    email: string
    name: string | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    googleId?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    googleId?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    googleId?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    googleId?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "googleId" | "email" | "name" | "createdAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      googleId: string
      email: string
      name: string | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly googleId: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const BodyAreaScalarFieldEnum: {
    id: 'id',
    label: 'label'
  };

  export type BodyAreaScalarFieldEnum = (typeof BodyAreaScalarFieldEnum)[keyof typeof BodyAreaScalarFieldEnum]


  export const MuscleGroupScalarFieldEnum: {
    id: 'id',
    label: 'label',
    bodyAreaId: 'bodyAreaId'
  };

  export type MuscleGroupScalarFieldEnum = (typeof MuscleGroupScalarFieldEnum)[keyof typeof MuscleGroupScalarFieldEnum]


  export const ExerciseScalarFieldEnum: {
    id: 'id',
    label: 'label',
    recordSetsType: 'recordSetsType',
    createdAt: 'createdAt'
  };

  export type ExerciseScalarFieldEnum = (typeof ExerciseScalarFieldEnum)[keyof typeof ExerciseScalarFieldEnum]


  export const ExercisePrimaryMuscleGroupScalarFieldEnum: {
    exerciseId: 'exerciseId',
    muscleGroupId: 'muscleGroupId'
  };

  export type ExercisePrimaryMuscleGroupScalarFieldEnum = (typeof ExercisePrimaryMuscleGroupScalarFieldEnum)[keyof typeof ExercisePrimaryMuscleGroupScalarFieldEnum]


  export const ExerciseSecondaryMuscleGroupScalarFieldEnum: {
    exerciseId: 'exerciseId',
    muscleGroupId: 'muscleGroupId'
  };

  export type ExerciseSecondaryMuscleGroupScalarFieldEnum = (typeof ExerciseSecondaryMuscleGroupScalarFieldEnum)[keyof typeof ExerciseSecondaryMuscleGroupScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    googleId: 'googleId',
    email: 'email',
    name: 'name',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'BodyAreaLabel'
   */
  export type EnumBodyAreaLabelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BodyAreaLabel'>
    


  /**
   * Reference to a field of type 'BodyAreaLabel[]'
   */
  export type ListEnumBodyAreaLabelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BodyAreaLabel[]'>
    


  /**
   * Reference to a field of type 'MuscleGroupLabel'
   */
  export type EnumMuscleGroupLabelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MuscleGroupLabel'>
    


  /**
   * Reference to a field of type 'MuscleGroupLabel[]'
   */
  export type ListEnumMuscleGroupLabelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MuscleGroupLabel[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'RecordSetsType'
   */
  export type EnumRecordSetsTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RecordSetsType'>
    


  /**
   * Reference to a field of type 'RecordSetsType[]'
   */
  export type ListEnumRecordSetsTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RecordSetsType[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type BodyAreaWhereInput = {
    AND?: BodyAreaWhereInput | BodyAreaWhereInput[]
    OR?: BodyAreaWhereInput[]
    NOT?: BodyAreaWhereInput | BodyAreaWhereInput[]
    id?: IntFilter<"BodyArea"> | number
    label?: EnumBodyAreaLabelFilter<"BodyArea"> | $Enums.BodyAreaLabel
    muscleGroups?: MuscleGroupListRelationFilter
  }

  export type BodyAreaOrderByWithRelationInput = {
    id?: SortOrder
    label?: SortOrder
    muscleGroups?: MuscleGroupOrderByRelationAggregateInput
  }

  export type BodyAreaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    label?: $Enums.BodyAreaLabel
    AND?: BodyAreaWhereInput | BodyAreaWhereInput[]
    OR?: BodyAreaWhereInput[]
    NOT?: BodyAreaWhereInput | BodyAreaWhereInput[]
    muscleGroups?: MuscleGroupListRelationFilter
  }, "id" | "label">

  export type BodyAreaOrderByWithAggregationInput = {
    id?: SortOrder
    label?: SortOrder
    _count?: BodyAreaCountOrderByAggregateInput
    _avg?: BodyAreaAvgOrderByAggregateInput
    _max?: BodyAreaMaxOrderByAggregateInput
    _min?: BodyAreaMinOrderByAggregateInput
    _sum?: BodyAreaSumOrderByAggregateInput
  }

  export type BodyAreaScalarWhereWithAggregatesInput = {
    AND?: BodyAreaScalarWhereWithAggregatesInput | BodyAreaScalarWhereWithAggregatesInput[]
    OR?: BodyAreaScalarWhereWithAggregatesInput[]
    NOT?: BodyAreaScalarWhereWithAggregatesInput | BodyAreaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"BodyArea"> | number
    label?: EnumBodyAreaLabelWithAggregatesFilter<"BodyArea"> | $Enums.BodyAreaLabel
  }

  export type MuscleGroupWhereInput = {
    AND?: MuscleGroupWhereInput | MuscleGroupWhereInput[]
    OR?: MuscleGroupWhereInput[]
    NOT?: MuscleGroupWhereInput | MuscleGroupWhereInput[]
    id?: IntFilter<"MuscleGroup"> | number
    label?: EnumMuscleGroupLabelFilter<"MuscleGroup"> | $Enums.MuscleGroupLabel
    bodyAreaId?: IntFilter<"MuscleGroup"> | number
    bodyArea?: XOR<BodyAreaScalarRelationFilter, BodyAreaWhereInput>
    primaryExercises?: ExercisePrimaryMuscleGroupListRelationFilter
    secondaryExercises?: ExerciseSecondaryMuscleGroupListRelationFilter
  }

  export type MuscleGroupOrderByWithRelationInput = {
    id?: SortOrder
    label?: SortOrder
    bodyAreaId?: SortOrder
    bodyArea?: BodyAreaOrderByWithRelationInput
    primaryExercises?: ExercisePrimaryMuscleGroupOrderByRelationAggregateInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupOrderByRelationAggregateInput
  }

  export type MuscleGroupWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    label?: $Enums.MuscleGroupLabel
    AND?: MuscleGroupWhereInput | MuscleGroupWhereInput[]
    OR?: MuscleGroupWhereInput[]
    NOT?: MuscleGroupWhereInput | MuscleGroupWhereInput[]
    bodyAreaId?: IntFilter<"MuscleGroup"> | number
    bodyArea?: XOR<BodyAreaScalarRelationFilter, BodyAreaWhereInput>
    primaryExercises?: ExercisePrimaryMuscleGroupListRelationFilter
    secondaryExercises?: ExerciseSecondaryMuscleGroupListRelationFilter
  }, "id" | "label">

  export type MuscleGroupOrderByWithAggregationInput = {
    id?: SortOrder
    label?: SortOrder
    bodyAreaId?: SortOrder
    _count?: MuscleGroupCountOrderByAggregateInput
    _avg?: MuscleGroupAvgOrderByAggregateInput
    _max?: MuscleGroupMaxOrderByAggregateInput
    _min?: MuscleGroupMinOrderByAggregateInput
    _sum?: MuscleGroupSumOrderByAggregateInput
  }

  export type MuscleGroupScalarWhereWithAggregatesInput = {
    AND?: MuscleGroupScalarWhereWithAggregatesInput | MuscleGroupScalarWhereWithAggregatesInput[]
    OR?: MuscleGroupScalarWhereWithAggregatesInput[]
    NOT?: MuscleGroupScalarWhereWithAggregatesInput | MuscleGroupScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MuscleGroup"> | number
    label?: EnumMuscleGroupLabelWithAggregatesFilter<"MuscleGroup"> | $Enums.MuscleGroupLabel
    bodyAreaId?: IntWithAggregatesFilter<"MuscleGroup"> | number
  }

  export type ExerciseWhereInput = {
    AND?: ExerciseWhereInput | ExerciseWhereInput[]
    OR?: ExerciseWhereInput[]
    NOT?: ExerciseWhereInput | ExerciseWhereInput[]
    id?: IntFilter<"Exercise"> | number
    label?: StringFilter<"Exercise"> | string
    recordSetsType?: EnumRecordSetsTypeFilter<"Exercise"> | $Enums.RecordSetsType
    createdAt?: DateTimeFilter<"Exercise"> | Date | string
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupListRelationFilter
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupListRelationFilter
  }

  export type ExerciseOrderByWithRelationInput = {
    id?: SortOrder
    label?: SortOrder
    recordSetsType?: SortOrder
    createdAt?: SortOrder
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupOrderByRelationAggregateInput
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupOrderByRelationAggregateInput
  }

  export type ExerciseWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ExerciseWhereInput | ExerciseWhereInput[]
    OR?: ExerciseWhereInput[]
    NOT?: ExerciseWhereInput | ExerciseWhereInput[]
    label?: StringFilter<"Exercise"> | string
    recordSetsType?: EnumRecordSetsTypeFilter<"Exercise"> | $Enums.RecordSetsType
    createdAt?: DateTimeFilter<"Exercise"> | Date | string
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupListRelationFilter
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupListRelationFilter
  }, "id">

  export type ExerciseOrderByWithAggregationInput = {
    id?: SortOrder
    label?: SortOrder
    recordSetsType?: SortOrder
    createdAt?: SortOrder
    _count?: ExerciseCountOrderByAggregateInput
    _avg?: ExerciseAvgOrderByAggregateInput
    _max?: ExerciseMaxOrderByAggregateInput
    _min?: ExerciseMinOrderByAggregateInput
    _sum?: ExerciseSumOrderByAggregateInput
  }

  export type ExerciseScalarWhereWithAggregatesInput = {
    AND?: ExerciseScalarWhereWithAggregatesInput | ExerciseScalarWhereWithAggregatesInput[]
    OR?: ExerciseScalarWhereWithAggregatesInput[]
    NOT?: ExerciseScalarWhereWithAggregatesInput | ExerciseScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Exercise"> | number
    label?: StringWithAggregatesFilter<"Exercise"> | string
    recordSetsType?: EnumRecordSetsTypeWithAggregatesFilter<"Exercise"> | $Enums.RecordSetsType
    createdAt?: DateTimeWithAggregatesFilter<"Exercise"> | Date | string
  }

  export type ExercisePrimaryMuscleGroupWhereInput = {
    AND?: ExercisePrimaryMuscleGroupWhereInput | ExercisePrimaryMuscleGroupWhereInput[]
    OR?: ExercisePrimaryMuscleGroupWhereInput[]
    NOT?: ExercisePrimaryMuscleGroupWhereInput | ExercisePrimaryMuscleGroupWhereInput[]
    exerciseId?: IntFilter<"ExercisePrimaryMuscleGroup"> | number
    muscleGroupId?: IntFilter<"ExercisePrimaryMuscleGroup"> | number
    exercise?: XOR<ExerciseScalarRelationFilter, ExerciseWhereInput>
    muscleGroup?: XOR<MuscleGroupScalarRelationFilter, MuscleGroupWhereInput>
  }

  export type ExercisePrimaryMuscleGroupOrderByWithRelationInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
    exercise?: ExerciseOrderByWithRelationInput
    muscleGroup?: MuscleGroupOrderByWithRelationInput
  }

  export type ExercisePrimaryMuscleGroupWhereUniqueInput = Prisma.AtLeast<{
    exerciseId_muscleGroupId?: ExercisePrimaryMuscleGroupExerciseIdMuscleGroupIdCompoundUniqueInput
    AND?: ExercisePrimaryMuscleGroupWhereInput | ExercisePrimaryMuscleGroupWhereInput[]
    OR?: ExercisePrimaryMuscleGroupWhereInput[]
    NOT?: ExercisePrimaryMuscleGroupWhereInput | ExercisePrimaryMuscleGroupWhereInput[]
    exerciseId?: IntFilter<"ExercisePrimaryMuscleGroup"> | number
    muscleGroupId?: IntFilter<"ExercisePrimaryMuscleGroup"> | number
    exercise?: XOR<ExerciseScalarRelationFilter, ExerciseWhereInput>
    muscleGroup?: XOR<MuscleGroupScalarRelationFilter, MuscleGroupWhereInput>
  }, "exerciseId_muscleGroupId">

  export type ExercisePrimaryMuscleGroupOrderByWithAggregationInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
    _count?: ExercisePrimaryMuscleGroupCountOrderByAggregateInput
    _avg?: ExercisePrimaryMuscleGroupAvgOrderByAggregateInput
    _max?: ExercisePrimaryMuscleGroupMaxOrderByAggregateInput
    _min?: ExercisePrimaryMuscleGroupMinOrderByAggregateInput
    _sum?: ExercisePrimaryMuscleGroupSumOrderByAggregateInput
  }

  export type ExercisePrimaryMuscleGroupScalarWhereWithAggregatesInput = {
    AND?: ExercisePrimaryMuscleGroupScalarWhereWithAggregatesInput | ExercisePrimaryMuscleGroupScalarWhereWithAggregatesInput[]
    OR?: ExercisePrimaryMuscleGroupScalarWhereWithAggregatesInput[]
    NOT?: ExercisePrimaryMuscleGroupScalarWhereWithAggregatesInput | ExercisePrimaryMuscleGroupScalarWhereWithAggregatesInput[]
    exerciseId?: IntWithAggregatesFilter<"ExercisePrimaryMuscleGroup"> | number
    muscleGroupId?: IntWithAggregatesFilter<"ExercisePrimaryMuscleGroup"> | number
  }

  export type ExerciseSecondaryMuscleGroupWhereInput = {
    AND?: ExerciseSecondaryMuscleGroupWhereInput | ExerciseSecondaryMuscleGroupWhereInput[]
    OR?: ExerciseSecondaryMuscleGroupWhereInput[]
    NOT?: ExerciseSecondaryMuscleGroupWhereInput | ExerciseSecondaryMuscleGroupWhereInput[]
    exerciseId?: IntFilter<"ExerciseSecondaryMuscleGroup"> | number
    muscleGroupId?: IntFilter<"ExerciseSecondaryMuscleGroup"> | number
    exercise?: XOR<ExerciseScalarRelationFilter, ExerciseWhereInput>
    muscleGroup?: XOR<MuscleGroupScalarRelationFilter, MuscleGroupWhereInput>
  }

  export type ExerciseSecondaryMuscleGroupOrderByWithRelationInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
    exercise?: ExerciseOrderByWithRelationInput
    muscleGroup?: MuscleGroupOrderByWithRelationInput
  }

  export type ExerciseSecondaryMuscleGroupWhereUniqueInput = Prisma.AtLeast<{
    exerciseId_muscleGroupId?: ExerciseSecondaryMuscleGroupExerciseIdMuscleGroupIdCompoundUniqueInput
    AND?: ExerciseSecondaryMuscleGroupWhereInput | ExerciseSecondaryMuscleGroupWhereInput[]
    OR?: ExerciseSecondaryMuscleGroupWhereInput[]
    NOT?: ExerciseSecondaryMuscleGroupWhereInput | ExerciseSecondaryMuscleGroupWhereInput[]
    exerciseId?: IntFilter<"ExerciseSecondaryMuscleGroup"> | number
    muscleGroupId?: IntFilter<"ExerciseSecondaryMuscleGroup"> | number
    exercise?: XOR<ExerciseScalarRelationFilter, ExerciseWhereInput>
    muscleGroup?: XOR<MuscleGroupScalarRelationFilter, MuscleGroupWhereInput>
  }, "exerciseId_muscleGroupId">

  export type ExerciseSecondaryMuscleGroupOrderByWithAggregationInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
    _count?: ExerciseSecondaryMuscleGroupCountOrderByAggregateInput
    _avg?: ExerciseSecondaryMuscleGroupAvgOrderByAggregateInput
    _max?: ExerciseSecondaryMuscleGroupMaxOrderByAggregateInput
    _min?: ExerciseSecondaryMuscleGroupMinOrderByAggregateInput
    _sum?: ExerciseSecondaryMuscleGroupSumOrderByAggregateInput
  }

  export type ExerciseSecondaryMuscleGroupScalarWhereWithAggregatesInput = {
    AND?: ExerciseSecondaryMuscleGroupScalarWhereWithAggregatesInput | ExerciseSecondaryMuscleGroupScalarWhereWithAggregatesInput[]
    OR?: ExerciseSecondaryMuscleGroupScalarWhereWithAggregatesInput[]
    NOT?: ExerciseSecondaryMuscleGroupScalarWhereWithAggregatesInput | ExerciseSecondaryMuscleGroupScalarWhereWithAggregatesInput[]
    exerciseId?: IntWithAggregatesFilter<"ExerciseSecondaryMuscleGroup"> | number
    muscleGroupId?: IntWithAggregatesFilter<"ExerciseSecondaryMuscleGroup"> | number
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    googleId?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    googleId?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    googleId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "googleId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    googleId?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    googleId?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type BodyAreaCreateInput = {
    label: $Enums.BodyAreaLabel
    muscleGroups?: MuscleGroupCreateNestedManyWithoutBodyAreaInput
  }

  export type BodyAreaUncheckedCreateInput = {
    id?: number
    label: $Enums.BodyAreaLabel
    muscleGroups?: MuscleGroupUncheckedCreateNestedManyWithoutBodyAreaInput
  }

  export type BodyAreaUpdateInput = {
    label?: EnumBodyAreaLabelFieldUpdateOperationsInput | $Enums.BodyAreaLabel
    muscleGroups?: MuscleGroupUpdateManyWithoutBodyAreaNestedInput
  }

  export type BodyAreaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: EnumBodyAreaLabelFieldUpdateOperationsInput | $Enums.BodyAreaLabel
    muscleGroups?: MuscleGroupUncheckedUpdateManyWithoutBodyAreaNestedInput
  }

  export type BodyAreaCreateManyInput = {
    id?: number
    label: $Enums.BodyAreaLabel
  }

  export type BodyAreaUpdateManyMutationInput = {
    label?: EnumBodyAreaLabelFieldUpdateOperationsInput | $Enums.BodyAreaLabel
  }

  export type BodyAreaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: EnumBodyAreaLabelFieldUpdateOperationsInput | $Enums.BodyAreaLabel
  }

  export type MuscleGroupCreateInput = {
    label: $Enums.MuscleGroupLabel
    bodyArea: BodyAreaCreateNestedOneWithoutMuscleGroupsInput
    primaryExercises?: ExercisePrimaryMuscleGroupCreateNestedManyWithoutMuscleGroupInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupCreateNestedManyWithoutMuscleGroupInput
  }

  export type MuscleGroupUncheckedCreateInput = {
    id?: number
    label: $Enums.MuscleGroupLabel
    bodyAreaId: number
    primaryExercises?: ExercisePrimaryMuscleGroupUncheckedCreateNestedManyWithoutMuscleGroupInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupUncheckedCreateNestedManyWithoutMuscleGroupInput
  }

  export type MuscleGroupUpdateInput = {
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
    bodyArea?: BodyAreaUpdateOneRequiredWithoutMuscleGroupsNestedInput
    primaryExercises?: ExercisePrimaryMuscleGroupUpdateManyWithoutMuscleGroupNestedInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupUpdateManyWithoutMuscleGroupNestedInput
  }

  export type MuscleGroupUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
    bodyAreaId?: IntFieldUpdateOperationsInput | number
    primaryExercises?: ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupNestedInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupNestedInput
  }

  export type MuscleGroupCreateManyInput = {
    id?: number
    label: $Enums.MuscleGroupLabel
    bodyAreaId: number
  }

  export type MuscleGroupUpdateManyMutationInput = {
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
  }

  export type MuscleGroupUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
    bodyAreaId?: IntFieldUpdateOperationsInput | number
  }

  export type ExerciseCreateInput = {
    label: string
    recordSetsType: $Enums.RecordSetsType
    createdAt?: Date | string
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupCreateNestedManyWithoutExerciseInput
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseUncheckedCreateInput = {
    id?: number
    label: string
    recordSetsType: $Enums.RecordSetsType
    createdAt?: Date | string
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupUncheckedCreateNestedManyWithoutExerciseInput
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupUncheckedCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseUpdateInput = {
    label?: StringFieldUpdateOperationsInput | string
    recordSetsType?: EnumRecordSetsTypeFieldUpdateOperationsInput | $Enums.RecordSetsType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupUpdateManyWithoutExerciseNestedInput
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupUpdateManyWithoutExerciseNestedInput
  }

  export type ExerciseUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    recordSetsType?: EnumRecordSetsTypeFieldUpdateOperationsInput | $Enums.RecordSetsType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutExerciseNestedInput
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutExerciseNestedInput
  }

  export type ExerciseCreateManyInput = {
    id?: number
    label: string
    recordSetsType: $Enums.RecordSetsType
    createdAt?: Date | string
  }

  export type ExerciseUpdateManyMutationInput = {
    label?: StringFieldUpdateOperationsInput | string
    recordSetsType?: EnumRecordSetsTypeFieldUpdateOperationsInput | $Enums.RecordSetsType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExerciseUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    recordSetsType?: EnumRecordSetsTypeFieldUpdateOperationsInput | $Enums.RecordSetsType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExercisePrimaryMuscleGroupCreateInput = {
    exercise: ExerciseCreateNestedOneWithoutPrimaryMuscleGroupsInput
    muscleGroup: MuscleGroupCreateNestedOneWithoutPrimaryExercisesInput
  }

  export type ExercisePrimaryMuscleGroupUncheckedCreateInput = {
    exerciseId: number
    muscleGroupId: number
  }

  export type ExercisePrimaryMuscleGroupUpdateInput = {
    exercise?: ExerciseUpdateOneRequiredWithoutPrimaryMuscleGroupsNestedInput
    muscleGroup?: MuscleGroupUpdateOneRequiredWithoutPrimaryExercisesNestedInput
  }

  export type ExercisePrimaryMuscleGroupUncheckedUpdateInput = {
    exerciseId?: IntFieldUpdateOperationsInput | number
    muscleGroupId?: IntFieldUpdateOperationsInput | number
  }

  export type ExercisePrimaryMuscleGroupCreateManyInput = {
    exerciseId: number
    muscleGroupId: number
  }

  export type ExercisePrimaryMuscleGroupUpdateManyMutationInput = {

  }

  export type ExercisePrimaryMuscleGroupUncheckedUpdateManyInput = {
    exerciseId?: IntFieldUpdateOperationsInput | number
    muscleGroupId?: IntFieldUpdateOperationsInput | number
  }

  export type ExerciseSecondaryMuscleGroupCreateInput = {
    exercise: ExerciseCreateNestedOneWithoutSecondaryMuscleGroupsInput
    muscleGroup: MuscleGroupCreateNestedOneWithoutSecondaryExercisesInput
  }

  export type ExerciseSecondaryMuscleGroupUncheckedCreateInput = {
    exerciseId: number
    muscleGroupId: number
  }

  export type ExerciseSecondaryMuscleGroupUpdateInput = {
    exercise?: ExerciseUpdateOneRequiredWithoutSecondaryMuscleGroupsNestedInput
    muscleGroup?: MuscleGroupUpdateOneRequiredWithoutSecondaryExercisesNestedInput
  }

  export type ExerciseSecondaryMuscleGroupUncheckedUpdateInput = {
    exerciseId?: IntFieldUpdateOperationsInput | number
    muscleGroupId?: IntFieldUpdateOperationsInput | number
  }

  export type ExerciseSecondaryMuscleGroupCreateManyInput = {
    exerciseId: number
    muscleGroupId: number
  }

  export type ExerciseSecondaryMuscleGroupUpdateManyMutationInput = {

  }

  export type ExerciseSecondaryMuscleGroupUncheckedUpdateManyInput = {
    exerciseId?: IntFieldUpdateOperationsInput | number
    muscleGroupId?: IntFieldUpdateOperationsInput | number
  }

  export type UserCreateInput = {
    googleId: string
    email: string
    name?: string | null
    createdAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: number
    googleId: string
    email: string
    name?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateInput = {
    googleId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    googleId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: number
    googleId: string
    email: string
    name?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    googleId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    googleId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumBodyAreaLabelFilter<$PrismaModel = never> = {
    equals?: $Enums.BodyAreaLabel | EnumBodyAreaLabelFieldRefInput<$PrismaModel>
    in?: $Enums.BodyAreaLabel[] | ListEnumBodyAreaLabelFieldRefInput<$PrismaModel>
    notIn?: $Enums.BodyAreaLabel[] | ListEnumBodyAreaLabelFieldRefInput<$PrismaModel>
    not?: NestedEnumBodyAreaLabelFilter<$PrismaModel> | $Enums.BodyAreaLabel
  }

  export type MuscleGroupListRelationFilter = {
    every?: MuscleGroupWhereInput
    some?: MuscleGroupWhereInput
    none?: MuscleGroupWhereInput
  }

  export type MuscleGroupOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BodyAreaCountOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
  }

  export type BodyAreaAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BodyAreaMaxOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
  }

  export type BodyAreaMinOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
  }

  export type BodyAreaSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumBodyAreaLabelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BodyAreaLabel | EnumBodyAreaLabelFieldRefInput<$PrismaModel>
    in?: $Enums.BodyAreaLabel[] | ListEnumBodyAreaLabelFieldRefInput<$PrismaModel>
    notIn?: $Enums.BodyAreaLabel[] | ListEnumBodyAreaLabelFieldRefInput<$PrismaModel>
    not?: NestedEnumBodyAreaLabelWithAggregatesFilter<$PrismaModel> | $Enums.BodyAreaLabel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBodyAreaLabelFilter<$PrismaModel>
    _max?: NestedEnumBodyAreaLabelFilter<$PrismaModel>
  }

  export type EnumMuscleGroupLabelFilter<$PrismaModel = never> = {
    equals?: $Enums.MuscleGroupLabel | EnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    in?: $Enums.MuscleGroupLabel[] | ListEnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    notIn?: $Enums.MuscleGroupLabel[] | ListEnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    not?: NestedEnumMuscleGroupLabelFilter<$PrismaModel> | $Enums.MuscleGroupLabel
  }

  export type BodyAreaScalarRelationFilter = {
    is?: BodyAreaWhereInput
    isNot?: BodyAreaWhereInput
  }

  export type ExercisePrimaryMuscleGroupListRelationFilter = {
    every?: ExercisePrimaryMuscleGroupWhereInput
    some?: ExercisePrimaryMuscleGroupWhereInput
    none?: ExercisePrimaryMuscleGroupWhereInput
  }

  export type ExerciseSecondaryMuscleGroupListRelationFilter = {
    every?: ExerciseSecondaryMuscleGroupWhereInput
    some?: ExerciseSecondaryMuscleGroupWhereInput
    none?: ExerciseSecondaryMuscleGroupWhereInput
  }

  export type ExercisePrimaryMuscleGroupOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExerciseSecondaryMuscleGroupOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MuscleGroupCountOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    bodyAreaId?: SortOrder
  }

  export type MuscleGroupAvgOrderByAggregateInput = {
    id?: SortOrder
    bodyAreaId?: SortOrder
  }

  export type MuscleGroupMaxOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    bodyAreaId?: SortOrder
  }

  export type MuscleGroupMinOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    bodyAreaId?: SortOrder
  }

  export type MuscleGroupSumOrderByAggregateInput = {
    id?: SortOrder
    bodyAreaId?: SortOrder
  }

  export type EnumMuscleGroupLabelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MuscleGroupLabel | EnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    in?: $Enums.MuscleGroupLabel[] | ListEnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    notIn?: $Enums.MuscleGroupLabel[] | ListEnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    not?: NestedEnumMuscleGroupLabelWithAggregatesFilter<$PrismaModel> | $Enums.MuscleGroupLabel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMuscleGroupLabelFilter<$PrismaModel>
    _max?: NestedEnumMuscleGroupLabelFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRecordSetsTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RecordSetsType | EnumRecordSetsTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RecordSetsType[] | ListEnumRecordSetsTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecordSetsType[] | ListEnumRecordSetsTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRecordSetsTypeFilter<$PrismaModel> | $Enums.RecordSetsType
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ExerciseCountOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    recordSetsType?: SortOrder
    createdAt?: SortOrder
  }

  export type ExerciseAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ExerciseMaxOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    recordSetsType?: SortOrder
    createdAt?: SortOrder
  }

  export type ExerciseMinOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    recordSetsType?: SortOrder
    createdAt?: SortOrder
  }

  export type ExerciseSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRecordSetsTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RecordSetsType | EnumRecordSetsTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RecordSetsType[] | ListEnumRecordSetsTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecordSetsType[] | ListEnumRecordSetsTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRecordSetsTypeWithAggregatesFilter<$PrismaModel> | $Enums.RecordSetsType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRecordSetsTypeFilter<$PrismaModel>
    _max?: NestedEnumRecordSetsTypeFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ExerciseScalarRelationFilter = {
    is?: ExerciseWhereInput
    isNot?: ExerciseWhereInput
  }

  export type MuscleGroupScalarRelationFilter = {
    is?: MuscleGroupWhereInput
    isNot?: MuscleGroupWhereInput
  }

  export type ExercisePrimaryMuscleGroupExerciseIdMuscleGroupIdCompoundUniqueInput = {
    exerciseId: number
    muscleGroupId: number
  }

  export type ExercisePrimaryMuscleGroupCountOrderByAggregateInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
  }

  export type ExercisePrimaryMuscleGroupAvgOrderByAggregateInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
  }

  export type ExercisePrimaryMuscleGroupMaxOrderByAggregateInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
  }

  export type ExercisePrimaryMuscleGroupMinOrderByAggregateInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
  }

  export type ExercisePrimaryMuscleGroupSumOrderByAggregateInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
  }

  export type ExerciseSecondaryMuscleGroupExerciseIdMuscleGroupIdCompoundUniqueInput = {
    exerciseId: number
    muscleGroupId: number
  }

  export type ExerciseSecondaryMuscleGroupCountOrderByAggregateInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
  }

  export type ExerciseSecondaryMuscleGroupAvgOrderByAggregateInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
  }

  export type ExerciseSecondaryMuscleGroupMaxOrderByAggregateInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
  }

  export type ExerciseSecondaryMuscleGroupMinOrderByAggregateInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
  }

  export type ExerciseSecondaryMuscleGroupSumOrderByAggregateInput = {
    exerciseId?: SortOrder
    muscleGroupId?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    googleId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    googleId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    googleId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type MuscleGroupCreateNestedManyWithoutBodyAreaInput = {
    create?: XOR<MuscleGroupCreateWithoutBodyAreaInput, MuscleGroupUncheckedCreateWithoutBodyAreaInput> | MuscleGroupCreateWithoutBodyAreaInput[] | MuscleGroupUncheckedCreateWithoutBodyAreaInput[]
    connectOrCreate?: MuscleGroupCreateOrConnectWithoutBodyAreaInput | MuscleGroupCreateOrConnectWithoutBodyAreaInput[]
    createMany?: MuscleGroupCreateManyBodyAreaInputEnvelope
    connect?: MuscleGroupWhereUniqueInput | MuscleGroupWhereUniqueInput[]
  }

  export type MuscleGroupUncheckedCreateNestedManyWithoutBodyAreaInput = {
    create?: XOR<MuscleGroupCreateWithoutBodyAreaInput, MuscleGroupUncheckedCreateWithoutBodyAreaInput> | MuscleGroupCreateWithoutBodyAreaInput[] | MuscleGroupUncheckedCreateWithoutBodyAreaInput[]
    connectOrCreate?: MuscleGroupCreateOrConnectWithoutBodyAreaInput | MuscleGroupCreateOrConnectWithoutBodyAreaInput[]
    createMany?: MuscleGroupCreateManyBodyAreaInputEnvelope
    connect?: MuscleGroupWhereUniqueInput | MuscleGroupWhereUniqueInput[]
  }

  export type EnumBodyAreaLabelFieldUpdateOperationsInput = {
    set?: $Enums.BodyAreaLabel
  }

  export type MuscleGroupUpdateManyWithoutBodyAreaNestedInput = {
    create?: XOR<MuscleGroupCreateWithoutBodyAreaInput, MuscleGroupUncheckedCreateWithoutBodyAreaInput> | MuscleGroupCreateWithoutBodyAreaInput[] | MuscleGroupUncheckedCreateWithoutBodyAreaInput[]
    connectOrCreate?: MuscleGroupCreateOrConnectWithoutBodyAreaInput | MuscleGroupCreateOrConnectWithoutBodyAreaInput[]
    upsert?: MuscleGroupUpsertWithWhereUniqueWithoutBodyAreaInput | MuscleGroupUpsertWithWhereUniqueWithoutBodyAreaInput[]
    createMany?: MuscleGroupCreateManyBodyAreaInputEnvelope
    set?: MuscleGroupWhereUniqueInput | MuscleGroupWhereUniqueInput[]
    disconnect?: MuscleGroupWhereUniqueInput | MuscleGroupWhereUniqueInput[]
    delete?: MuscleGroupWhereUniqueInput | MuscleGroupWhereUniqueInput[]
    connect?: MuscleGroupWhereUniqueInput | MuscleGroupWhereUniqueInput[]
    update?: MuscleGroupUpdateWithWhereUniqueWithoutBodyAreaInput | MuscleGroupUpdateWithWhereUniqueWithoutBodyAreaInput[]
    updateMany?: MuscleGroupUpdateManyWithWhereWithoutBodyAreaInput | MuscleGroupUpdateManyWithWhereWithoutBodyAreaInput[]
    deleteMany?: MuscleGroupScalarWhereInput | MuscleGroupScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MuscleGroupUncheckedUpdateManyWithoutBodyAreaNestedInput = {
    create?: XOR<MuscleGroupCreateWithoutBodyAreaInput, MuscleGroupUncheckedCreateWithoutBodyAreaInput> | MuscleGroupCreateWithoutBodyAreaInput[] | MuscleGroupUncheckedCreateWithoutBodyAreaInput[]
    connectOrCreate?: MuscleGroupCreateOrConnectWithoutBodyAreaInput | MuscleGroupCreateOrConnectWithoutBodyAreaInput[]
    upsert?: MuscleGroupUpsertWithWhereUniqueWithoutBodyAreaInput | MuscleGroupUpsertWithWhereUniqueWithoutBodyAreaInput[]
    createMany?: MuscleGroupCreateManyBodyAreaInputEnvelope
    set?: MuscleGroupWhereUniqueInput | MuscleGroupWhereUniqueInput[]
    disconnect?: MuscleGroupWhereUniqueInput | MuscleGroupWhereUniqueInput[]
    delete?: MuscleGroupWhereUniqueInput | MuscleGroupWhereUniqueInput[]
    connect?: MuscleGroupWhereUniqueInput | MuscleGroupWhereUniqueInput[]
    update?: MuscleGroupUpdateWithWhereUniqueWithoutBodyAreaInput | MuscleGroupUpdateWithWhereUniqueWithoutBodyAreaInput[]
    updateMany?: MuscleGroupUpdateManyWithWhereWithoutBodyAreaInput | MuscleGroupUpdateManyWithWhereWithoutBodyAreaInput[]
    deleteMany?: MuscleGroupScalarWhereInput | MuscleGroupScalarWhereInput[]
  }

  export type BodyAreaCreateNestedOneWithoutMuscleGroupsInput = {
    create?: XOR<BodyAreaCreateWithoutMuscleGroupsInput, BodyAreaUncheckedCreateWithoutMuscleGroupsInput>
    connectOrCreate?: BodyAreaCreateOrConnectWithoutMuscleGroupsInput
    connect?: BodyAreaWhereUniqueInput
  }

  export type ExercisePrimaryMuscleGroupCreateNestedManyWithoutMuscleGroupInput = {
    create?: XOR<ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput> | ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput[] | ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput[]
    connectOrCreate?: ExercisePrimaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput | ExercisePrimaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput[]
    createMany?: ExercisePrimaryMuscleGroupCreateManyMuscleGroupInputEnvelope
    connect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
  }

  export type ExerciseSecondaryMuscleGroupCreateNestedManyWithoutMuscleGroupInput = {
    create?: XOR<ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput> | ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput[] | ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput[]
    connectOrCreate?: ExerciseSecondaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput | ExerciseSecondaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput[]
    createMany?: ExerciseSecondaryMuscleGroupCreateManyMuscleGroupInputEnvelope
    connect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
  }

  export type ExercisePrimaryMuscleGroupUncheckedCreateNestedManyWithoutMuscleGroupInput = {
    create?: XOR<ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput> | ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput[] | ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput[]
    connectOrCreate?: ExercisePrimaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput | ExercisePrimaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput[]
    createMany?: ExercisePrimaryMuscleGroupCreateManyMuscleGroupInputEnvelope
    connect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
  }

  export type ExerciseSecondaryMuscleGroupUncheckedCreateNestedManyWithoutMuscleGroupInput = {
    create?: XOR<ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput> | ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput[] | ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput[]
    connectOrCreate?: ExerciseSecondaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput | ExerciseSecondaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput[]
    createMany?: ExerciseSecondaryMuscleGroupCreateManyMuscleGroupInputEnvelope
    connect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
  }

  export type EnumMuscleGroupLabelFieldUpdateOperationsInput = {
    set?: $Enums.MuscleGroupLabel
  }

  export type BodyAreaUpdateOneRequiredWithoutMuscleGroupsNestedInput = {
    create?: XOR<BodyAreaCreateWithoutMuscleGroupsInput, BodyAreaUncheckedCreateWithoutMuscleGroupsInput>
    connectOrCreate?: BodyAreaCreateOrConnectWithoutMuscleGroupsInput
    upsert?: BodyAreaUpsertWithoutMuscleGroupsInput
    connect?: BodyAreaWhereUniqueInput
    update?: XOR<XOR<BodyAreaUpdateToOneWithWhereWithoutMuscleGroupsInput, BodyAreaUpdateWithoutMuscleGroupsInput>, BodyAreaUncheckedUpdateWithoutMuscleGroupsInput>
  }

  export type ExercisePrimaryMuscleGroupUpdateManyWithoutMuscleGroupNestedInput = {
    create?: XOR<ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput> | ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput[] | ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput[]
    connectOrCreate?: ExercisePrimaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput | ExercisePrimaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput[]
    upsert?: ExercisePrimaryMuscleGroupUpsertWithWhereUniqueWithoutMuscleGroupInput | ExercisePrimaryMuscleGroupUpsertWithWhereUniqueWithoutMuscleGroupInput[]
    createMany?: ExercisePrimaryMuscleGroupCreateManyMuscleGroupInputEnvelope
    set?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    disconnect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    delete?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    connect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    update?: ExercisePrimaryMuscleGroupUpdateWithWhereUniqueWithoutMuscleGroupInput | ExercisePrimaryMuscleGroupUpdateWithWhereUniqueWithoutMuscleGroupInput[]
    updateMany?: ExercisePrimaryMuscleGroupUpdateManyWithWhereWithoutMuscleGroupInput | ExercisePrimaryMuscleGroupUpdateManyWithWhereWithoutMuscleGroupInput[]
    deleteMany?: ExercisePrimaryMuscleGroupScalarWhereInput | ExercisePrimaryMuscleGroupScalarWhereInput[]
  }

  export type ExerciseSecondaryMuscleGroupUpdateManyWithoutMuscleGroupNestedInput = {
    create?: XOR<ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput> | ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput[] | ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput[]
    connectOrCreate?: ExerciseSecondaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput | ExerciseSecondaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput[]
    upsert?: ExerciseSecondaryMuscleGroupUpsertWithWhereUniqueWithoutMuscleGroupInput | ExerciseSecondaryMuscleGroupUpsertWithWhereUniqueWithoutMuscleGroupInput[]
    createMany?: ExerciseSecondaryMuscleGroupCreateManyMuscleGroupInputEnvelope
    set?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    disconnect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    delete?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    connect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    update?: ExerciseSecondaryMuscleGroupUpdateWithWhereUniqueWithoutMuscleGroupInput | ExerciseSecondaryMuscleGroupUpdateWithWhereUniqueWithoutMuscleGroupInput[]
    updateMany?: ExerciseSecondaryMuscleGroupUpdateManyWithWhereWithoutMuscleGroupInput | ExerciseSecondaryMuscleGroupUpdateManyWithWhereWithoutMuscleGroupInput[]
    deleteMany?: ExerciseSecondaryMuscleGroupScalarWhereInput | ExerciseSecondaryMuscleGroupScalarWhereInput[]
  }

  export type ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupNestedInput = {
    create?: XOR<ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput> | ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput[] | ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput[]
    connectOrCreate?: ExercisePrimaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput | ExercisePrimaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput[]
    upsert?: ExercisePrimaryMuscleGroupUpsertWithWhereUniqueWithoutMuscleGroupInput | ExercisePrimaryMuscleGroupUpsertWithWhereUniqueWithoutMuscleGroupInput[]
    createMany?: ExercisePrimaryMuscleGroupCreateManyMuscleGroupInputEnvelope
    set?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    disconnect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    delete?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    connect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    update?: ExercisePrimaryMuscleGroupUpdateWithWhereUniqueWithoutMuscleGroupInput | ExercisePrimaryMuscleGroupUpdateWithWhereUniqueWithoutMuscleGroupInput[]
    updateMany?: ExercisePrimaryMuscleGroupUpdateManyWithWhereWithoutMuscleGroupInput | ExercisePrimaryMuscleGroupUpdateManyWithWhereWithoutMuscleGroupInput[]
    deleteMany?: ExercisePrimaryMuscleGroupScalarWhereInput | ExercisePrimaryMuscleGroupScalarWhereInput[]
  }

  export type ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupNestedInput = {
    create?: XOR<ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput> | ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput[] | ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput[]
    connectOrCreate?: ExerciseSecondaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput | ExerciseSecondaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput[]
    upsert?: ExerciseSecondaryMuscleGroupUpsertWithWhereUniqueWithoutMuscleGroupInput | ExerciseSecondaryMuscleGroupUpsertWithWhereUniqueWithoutMuscleGroupInput[]
    createMany?: ExerciseSecondaryMuscleGroupCreateManyMuscleGroupInputEnvelope
    set?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    disconnect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    delete?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    connect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    update?: ExerciseSecondaryMuscleGroupUpdateWithWhereUniqueWithoutMuscleGroupInput | ExerciseSecondaryMuscleGroupUpdateWithWhereUniqueWithoutMuscleGroupInput[]
    updateMany?: ExerciseSecondaryMuscleGroupUpdateManyWithWhereWithoutMuscleGroupInput | ExerciseSecondaryMuscleGroupUpdateManyWithWhereWithoutMuscleGroupInput[]
    deleteMany?: ExerciseSecondaryMuscleGroupScalarWhereInput | ExerciseSecondaryMuscleGroupScalarWhereInput[]
  }

  export type ExercisePrimaryMuscleGroupCreateNestedManyWithoutExerciseInput = {
    create?: XOR<ExercisePrimaryMuscleGroupCreateWithoutExerciseInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput> | ExercisePrimaryMuscleGroupCreateWithoutExerciseInput[] | ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExercisePrimaryMuscleGroupCreateOrConnectWithoutExerciseInput | ExercisePrimaryMuscleGroupCreateOrConnectWithoutExerciseInput[]
    createMany?: ExercisePrimaryMuscleGroupCreateManyExerciseInputEnvelope
    connect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
  }

  export type ExerciseSecondaryMuscleGroupCreateNestedManyWithoutExerciseInput = {
    create?: XOR<ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput> | ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput[] | ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseSecondaryMuscleGroupCreateOrConnectWithoutExerciseInput | ExerciseSecondaryMuscleGroupCreateOrConnectWithoutExerciseInput[]
    createMany?: ExerciseSecondaryMuscleGroupCreateManyExerciseInputEnvelope
    connect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
  }

  export type ExercisePrimaryMuscleGroupUncheckedCreateNestedManyWithoutExerciseInput = {
    create?: XOR<ExercisePrimaryMuscleGroupCreateWithoutExerciseInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput> | ExercisePrimaryMuscleGroupCreateWithoutExerciseInput[] | ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExercisePrimaryMuscleGroupCreateOrConnectWithoutExerciseInput | ExercisePrimaryMuscleGroupCreateOrConnectWithoutExerciseInput[]
    createMany?: ExercisePrimaryMuscleGroupCreateManyExerciseInputEnvelope
    connect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
  }

  export type ExerciseSecondaryMuscleGroupUncheckedCreateNestedManyWithoutExerciseInput = {
    create?: XOR<ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput> | ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput[] | ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseSecondaryMuscleGroupCreateOrConnectWithoutExerciseInput | ExerciseSecondaryMuscleGroupCreateOrConnectWithoutExerciseInput[]
    createMany?: ExerciseSecondaryMuscleGroupCreateManyExerciseInputEnvelope
    connect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRecordSetsTypeFieldUpdateOperationsInput = {
    set?: $Enums.RecordSetsType
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ExercisePrimaryMuscleGroupUpdateManyWithoutExerciseNestedInput = {
    create?: XOR<ExercisePrimaryMuscleGroupCreateWithoutExerciseInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput> | ExercisePrimaryMuscleGroupCreateWithoutExerciseInput[] | ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExercisePrimaryMuscleGroupCreateOrConnectWithoutExerciseInput | ExercisePrimaryMuscleGroupCreateOrConnectWithoutExerciseInput[]
    upsert?: ExercisePrimaryMuscleGroupUpsertWithWhereUniqueWithoutExerciseInput | ExercisePrimaryMuscleGroupUpsertWithWhereUniqueWithoutExerciseInput[]
    createMany?: ExercisePrimaryMuscleGroupCreateManyExerciseInputEnvelope
    set?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    disconnect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    delete?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    connect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    update?: ExercisePrimaryMuscleGroupUpdateWithWhereUniqueWithoutExerciseInput | ExercisePrimaryMuscleGroupUpdateWithWhereUniqueWithoutExerciseInput[]
    updateMany?: ExercisePrimaryMuscleGroupUpdateManyWithWhereWithoutExerciseInput | ExercisePrimaryMuscleGroupUpdateManyWithWhereWithoutExerciseInput[]
    deleteMany?: ExercisePrimaryMuscleGroupScalarWhereInput | ExercisePrimaryMuscleGroupScalarWhereInput[]
  }

  export type ExerciseSecondaryMuscleGroupUpdateManyWithoutExerciseNestedInput = {
    create?: XOR<ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput> | ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput[] | ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseSecondaryMuscleGroupCreateOrConnectWithoutExerciseInput | ExerciseSecondaryMuscleGroupCreateOrConnectWithoutExerciseInput[]
    upsert?: ExerciseSecondaryMuscleGroupUpsertWithWhereUniqueWithoutExerciseInput | ExerciseSecondaryMuscleGroupUpsertWithWhereUniqueWithoutExerciseInput[]
    createMany?: ExerciseSecondaryMuscleGroupCreateManyExerciseInputEnvelope
    set?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    disconnect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    delete?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    connect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    update?: ExerciseSecondaryMuscleGroupUpdateWithWhereUniqueWithoutExerciseInput | ExerciseSecondaryMuscleGroupUpdateWithWhereUniqueWithoutExerciseInput[]
    updateMany?: ExerciseSecondaryMuscleGroupUpdateManyWithWhereWithoutExerciseInput | ExerciseSecondaryMuscleGroupUpdateManyWithWhereWithoutExerciseInput[]
    deleteMany?: ExerciseSecondaryMuscleGroupScalarWhereInput | ExerciseSecondaryMuscleGroupScalarWhereInput[]
  }

  export type ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutExerciseNestedInput = {
    create?: XOR<ExercisePrimaryMuscleGroupCreateWithoutExerciseInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput> | ExercisePrimaryMuscleGroupCreateWithoutExerciseInput[] | ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExercisePrimaryMuscleGroupCreateOrConnectWithoutExerciseInput | ExercisePrimaryMuscleGroupCreateOrConnectWithoutExerciseInput[]
    upsert?: ExercisePrimaryMuscleGroupUpsertWithWhereUniqueWithoutExerciseInput | ExercisePrimaryMuscleGroupUpsertWithWhereUniqueWithoutExerciseInput[]
    createMany?: ExercisePrimaryMuscleGroupCreateManyExerciseInputEnvelope
    set?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    disconnect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    delete?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    connect?: ExercisePrimaryMuscleGroupWhereUniqueInput | ExercisePrimaryMuscleGroupWhereUniqueInput[]
    update?: ExercisePrimaryMuscleGroupUpdateWithWhereUniqueWithoutExerciseInput | ExercisePrimaryMuscleGroupUpdateWithWhereUniqueWithoutExerciseInput[]
    updateMany?: ExercisePrimaryMuscleGroupUpdateManyWithWhereWithoutExerciseInput | ExercisePrimaryMuscleGroupUpdateManyWithWhereWithoutExerciseInput[]
    deleteMany?: ExercisePrimaryMuscleGroupScalarWhereInput | ExercisePrimaryMuscleGroupScalarWhereInput[]
  }

  export type ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutExerciseNestedInput = {
    create?: XOR<ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput> | ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput[] | ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseSecondaryMuscleGroupCreateOrConnectWithoutExerciseInput | ExerciseSecondaryMuscleGroupCreateOrConnectWithoutExerciseInput[]
    upsert?: ExerciseSecondaryMuscleGroupUpsertWithWhereUniqueWithoutExerciseInput | ExerciseSecondaryMuscleGroupUpsertWithWhereUniqueWithoutExerciseInput[]
    createMany?: ExerciseSecondaryMuscleGroupCreateManyExerciseInputEnvelope
    set?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    disconnect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    delete?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    connect?: ExerciseSecondaryMuscleGroupWhereUniqueInput | ExerciseSecondaryMuscleGroupWhereUniqueInput[]
    update?: ExerciseSecondaryMuscleGroupUpdateWithWhereUniqueWithoutExerciseInput | ExerciseSecondaryMuscleGroupUpdateWithWhereUniqueWithoutExerciseInput[]
    updateMany?: ExerciseSecondaryMuscleGroupUpdateManyWithWhereWithoutExerciseInput | ExerciseSecondaryMuscleGroupUpdateManyWithWhereWithoutExerciseInput[]
    deleteMany?: ExerciseSecondaryMuscleGroupScalarWhereInput | ExerciseSecondaryMuscleGroupScalarWhereInput[]
  }

  export type ExerciseCreateNestedOneWithoutPrimaryMuscleGroupsInput = {
    create?: XOR<ExerciseCreateWithoutPrimaryMuscleGroupsInput, ExerciseUncheckedCreateWithoutPrimaryMuscleGroupsInput>
    connectOrCreate?: ExerciseCreateOrConnectWithoutPrimaryMuscleGroupsInput
    connect?: ExerciseWhereUniqueInput
  }

  export type MuscleGroupCreateNestedOneWithoutPrimaryExercisesInput = {
    create?: XOR<MuscleGroupCreateWithoutPrimaryExercisesInput, MuscleGroupUncheckedCreateWithoutPrimaryExercisesInput>
    connectOrCreate?: MuscleGroupCreateOrConnectWithoutPrimaryExercisesInput
    connect?: MuscleGroupWhereUniqueInput
  }

  export type ExerciseUpdateOneRequiredWithoutPrimaryMuscleGroupsNestedInput = {
    create?: XOR<ExerciseCreateWithoutPrimaryMuscleGroupsInput, ExerciseUncheckedCreateWithoutPrimaryMuscleGroupsInput>
    connectOrCreate?: ExerciseCreateOrConnectWithoutPrimaryMuscleGroupsInput
    upsert?: ExerciseUpsertWithoutPrimaryMuscleGroupsInput
    connect?: ExerciseWhereUniqueInput
    update?: XOR<XOR<ExerciseUpdateToOneWithWhereWithoutPrimaryMuscleGroupsInput, ExerciseUpdateWithoutPrimaryMuscleGroupsInput>, ExerciseUncheckedUpdateWithoutPrimaryMuscleGroupsInput>
  }

  export type MuscleGroupUpdateOneRequiredWithoutPrimaryExercisesNestedInput = {
    create?: XOR<MuscleGroupCreateWithoutPrimaryExercisesInput, MuscleGroupUncheckedCreateWithoutPrimaryExercisesInput>
    connectOrCreate?: MuscleGroupCreateOrConnectWithoutPrimaryExercisesInput
    upsert?: MuscleGroupUpsertWithoutPrimaryExercisesInput
    connect?: MuscleGroupWhereUniqueInput
    update?: XOR<XOR<MuscleGroupUpdateToOneWithWhereWithoutPrimaryExercisesInput, MuscleGroupUpdateWithoutPrimaryExercisesInput>, MuscleGroupUncheckedUpdateWithoutPrimaryExercisesInput>
  }

  export type ExerciseCreateNestedOneWithoutSecondaryMuscleGroupsInput = {
    create?: XOR<ExerciseCreateWithoutSecondaryMuscleGroupsInput, ExerciseUncheckedCreateWithoutSecondaryMuscleGroupsInput>
    connectOrCreate?: ExerciseCreateOrConnectWithoutSecondaryMuscleGroupsInput
    connect?: ExerciseWhereUniqueInput
  }

  export type MuscleGroupCreateNestedOneWithoutSecondaryExercisesInput = {
    create?: XOR<MuscleGroupCreateWithoutSecondaryExercisesInput, MuscleGroupUncheckedCreateWithoutSecondaryExercisesInput>
    connectOrCreate?: MuscleGroupCreateOrConnectWithoutSecondaryExercisesInput
    connect?: MuscleGroupWhereUniqueInput
  }

  export type ExerciseUpdateOneRequiredWithoutSecondaryMuscleGroupsNestedInput = {
    create?: XOR<ExerciseCreateWithoutSecondaryMuscleGroupsInput, ExerciseUncheckedCreateWithoutSecondaryMuscleGroupsInput>
    connectOrCreate?: ExerciseCreateOrConnectWithoutSecondaryMuscleGroupsInput
    upsert?: ExerciseUpsertWithoutSecondaryMuscleGroupsInput
    connect?: ExerciseWhereUniqueInput
    update?: XOR<XOR<ExerciseUpdateToOneWithWhereWithoutSecondaryMuscleGroupsInput, ExerciseUpdateWithoutSecondaryMuscleGroupsInput>, ExerciseUncheckedUpdateWithoutSecondaryMuscleGroupsInput>
  }

  export type MuscleGroupUpdateOneRequiredWithoutSecondaryExercisesNestedInput = {
    create?: XOR<MuscleGroupCreateWithoutSecondaryExercisesInput, MuscleGroupUncheckedCreateWithoutSecondaryExercisesInput>
    connectOrCreate?: MuscleGroupCreateOrConnectWithoutSecondaryExercisesInput
    upsert?: MuscleGroupUpsertWithoutSecondaryExercisesInput
    connect?: MuscleGroupWhereUniqueInput
    update?: XOR<XOR<MuscleGroupUpdateToOneWithWhereWithoutSecondaryExercisesInput, MuscleGroupUpdateWithoutSecondaryExercisesInput>, MuscleGroupUncheckedUpdateWithoutSecondaryExercisesInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumBodyAreaLabelFilter<$PrismaModel = never> = {
    equals?: $Enums.BodyAreaLabel | EnumBodyAreaLabelFieldRefInput<$PrismaModel>
    in?: $Enums.BodyAreaLabel[] | ListEnumBodyAreaLabelFieldRefInput<$PrismaModel>
    notIn?: $Enums.BodyAreaLabel[] | ListEnumBodyAreaLabelFieldRefInput<$PrismaModel>
    not?: NestedEnumBodyAreaLabelFilter<$PrismaModel> | $Enums.BodyAreaLabel
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumBodyAreaLabelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BodyAreaLabel | EnumBodyAreaLabelFieldRefInput<$PrismaModel>
    in?: $Enums.BodyAreaLabel[] | ListEnumBodyAreaLabelFieldRefInput<$PrismaModel>
    notIn?: $Enums.BodyAreaLabel[] | ListEnumBodyAreaLabelFieldRefInput<$PrismaModel>
    not?: NestedEnumBodyAreaLabelWithAggregatesFilter<$PrismaModel> | $Enums.BodyAreaLabel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBodyAreaLabelFilter<$PrismaModel>
    _max?: NestedEnumBodyAreaLabelFilter<$PrismaModel>
  }

  export type NestedEnumMuscleGroupLabelFilter<$PrismaModel = never> = {
    equals?: $Enums.MuscleGroupLabel | EnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    in?: $Enums.MuscleGroupLabel[] | ListEnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    notIn?: $Enums.MuscleGroupLabel[] | ListEnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    not?: NestedEnumMuscleGroupLabelFilter<$PrismaModel> | $Enums.MuscleGroupLabel
  }

  export type NestedEnumMuscleGroupLabelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MuscleGroupLabel | EnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    in?: $Enums.MuscleGroupLabel[] | ListEnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    notIn?: $Enums.MuscleGroupLabel[] | ListEnumMuscleGroupLabelFieldRefInput<$PrismaModel>
    not?: NestedEnumMuscleGroupLabelWithAggregatesFilter<$PrismaModel> | $Enums.MuscleGroupLabel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMuscleGroupLabelFilter<$PrismaModel>
    _max?: NestedEnumMuscleGroupLabelFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRecordSetsTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RecordSetsType | EnumRecordSetsTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RecordSetsType[] | ListEnumRecordSetsTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecordSetsType[] | ListEnumRecordSetsTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRecordSetsTypeFilter<$PrismaModel> | $Enums.RecordSetsType
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumRecordSetsTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RecordSetsType | EnumRecordSetsTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RecordSetsType[] | ListEnumRecordSetsTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecordSetsType[] | ListEnumRecordSetsTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRecordSetsTypeWithAggregatesFilter<$PrismaModel> | $Enums.RecordSetsType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRecordSetsTypeFilter<$PrismaModel>
    _max?: NestedEnumRecordSetsTypeFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type MuscleGroupCreateWithoutBodyAreaInput = {
    label: $Enums.MuscleGroupLabel
    primaryExercises?: ExercisePrimaryMuscleGroupCreateNestedManyWithoutMuscleGroupInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupCreateNestedManyWithoutMuscleGroupInput
  }

  export type MuscleGroupUncheckedCreateWithoutBodyAreaInput = {
    id?: number
    label: $Enums.MuscleGroupLabel
    primaryExercises?: ExercisePrimaryMuscleGroupUncheckedCreateNestedManyWithoutMuscleGroupInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupUncheckedCreateNestedManyWithoutMuscleGroupInput
  }

  export type MuscleGroupCreateOrConnectWithoutBodyAreaInput = {
    where: MuscleGroupWhereUniqueInput
    create: XOR<MuscleGroupCreateWithoutBodyAreaInput, MuscleGroupUncheckedCreateWithoutBodyAreaInput>
  }

  export type MuscleGroupCreateManyBodyAreaInputEnvelope = {
    data: MuscleGroupCreateManyBodyAreaInput | MuscleGroupCreateManyBodyAreaInput[]
    skipDuplicates?: boolean
  }

  export type MuscleGroupUpsertWithWhereUniqueWithoutBodyAreaInput = {
    where: MuscleGroupWhereUniqueInput
    update: XOR<MuscleGroupUpdateWithoutBodyAreaInput, MuscleGroupUncheckedUpdateWithoutBodyAreaInput>
    create: XOR<MuscleGroupCreateWithoutBodyAreaInput, MuscleGroupUncheckedCreateWithoutBodyAreaInput>
  }

  export type MuscleGroupUpdateWithWhereUniqueWithoutBodyAreaInput = {
    where: MuscleGroupWhereUniqueInput
    data: XOR<MuscleGroupUpdateWithoutBodyAreaInput, MuscleGroupUncheckedUpdateWithoutBodyAreaInput>
  }

  export type MuscleGroupUpdateManyWithWhereWithoutBodyAreaInput = {
    where: MuscleGroupScalarWhereInput
    data: XOR<MuscleGroupUpdateManyMutationInput, MuscleGroupUncheckedUpdateManyWithoutBodyAreaInput>
  }

  export type MuscleGroupScalarWhereInput = {
    AND?: MuscleGroupScalarWhereInput | MuscleGroupScalarWhereInput[]
    OR?: MuscleGroupScalarWhereInput[]
    NOT?: MuscleGroupScalarWhereInput | MuscleGroupScalarWhereInput[]
    id?: IntFilter<"MuscleGroup"> | number
    label?: EnumMuscleGroupLabelFilter<"MuscleGroup"> | $Enums.MuscleGroupLabel
    bodyAreaId?: IntFilter<"MuscleGroup"> | number
  }

  export type BodyAreaCreateWithoutMuscleGroupsInput = {
    label: $Enums.BodyAreaLabel
  }

  export type BodyAreaUncheckedCreateWithoutMuscleGroupsInput = {
    id?: number
    label: $Enums.BodyAreaLabel
  }

  export type BodyAreaCreateOrConnectWithoutMuscleGroupsInput = {
    where: BodyAreaWhereUniqueInput
    create: XOR<BodyAreaCreateWithoutMuscleGroupsInput, BodyAreaUncheckedCreateWithoutMuscleGroupsInput>
  }

  export type ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput = {
    exercise: ExerciseCreateNestedOneWithoutPrimaryMuscleGroupsInput
  }

  export type ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput = {
    exerciseId: number
  }

  export type ExercisePrimaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput = {
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
    create: XOR<ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput>
  }

  export type ExercisePrimaryMuscleGroupCreateManyMuscleGroupInputEnvelope = {
    data: ExercisePrimaryMuscleGroupCreateManyMuscleGroupInput | ExercisePrimaryMuscleGroupCreateManyMuscleGroupInput[]
    skipDuplicates?: boolean
  }

  export type ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput = {
    exercise: ExerciseCreateNestedOneWithoutSecondaryMuscleGroupsInput
  }

  export type ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput = {
    exerciseId: number
  }

  export type ExerciseSecondaryMuscleGroupCreateOrConnectWithoutMuscleGroupInput = {
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
    create: XOR<ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput>
  }

  export type ExerciseSecondaryMuscleGroupCreateManyMuscleGroupInputEnvelope = {
    data: ExerciseSecondaryMuscleGroupCreateManyMuscleGroupInput | ExerciseSecondaryMuscleGroupCreateManyMuscleGroupInput[]
    skipDuplicates?: boolean
  }

  export type BodyAreaUpsertWithoutMuscleGroupsInput = {
    update: XOR<BodyAreaUpdateWithoutMuscleGroupsInput, BodyAreaUncheckedUpdateWithoutMuscleGroupsInput>
    create: XOR<BodyAreaCreateWithoutMuscleGroupsInput, BodyAreaUncheckedCreateWithoutMuscleGroupsInput>
    where?: BodyAreaWhereInput
  }

  export type BodyAreaUpdateToOneWithWhereWithoutMuscleGroupsInput = {
    where?: BodyAreaWhereInput
    data: XOR<BodyAreaUpdateWithoutMuscleGroupsInput, BodyAreaUncheckedUpdateWithoutMuscleGroupsInput>
  }

  export type BodyAreaUpdateWithoutMuscleGroupsInput = {
    label?: EnumBodyAreaLabelFieldUpdateOperationsInput | $Enums.BodyAreaLabel
  }

  export type BodyAreaUncheckedUpdateWithoutMuscleGroupsInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: EnumBodyAreaLabelFieldUpdateOperationsInput | $Enums.BodyAreaLabel
  }

  export type ExercisePrimaryMuscleGroupUpsertWithWhereUniqueWithoutMuscleGroupInput = {
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
    update: XOR<ExercisePrimaryMuscleGroupUpdateWithoutMuscleGroupInput, ExercisePrimaryMuscleGroupUncheckedUpdateWithoutMuscleGroupInput>
    create: XOR<ExercisePrimaryMuscleGroupCreateWithoutMuscleGroupInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput>
  }

  export type ExercisePrimaryMuscleGroupUpdateWithWhereUniqueWithoutMuscleGroupInput = {
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
    data: XOR<ExercisePrimaryMuscleGroupUpdateWithoutMuscleGroupInput, ExercisePrimaryMuscleGroupUncheckedUpdateWithoutMuscleGroupInput>
  }

  export type ExercisePrimaryMuscleGroupUpdateManyWithWhereWithoutMuscleGroupInput = {
    where: ExercisePrimaryMuscleGroupScalarWhereInput
    data: XOR<ExercisePrimaryMuscleGroupUpdateManyMutationInput, ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupInput>
  }

  export type ExercisePrimaryMuscleGroupScalarWhereInput = {
    AND?: ExercisePrimaryMuscleGroupScalarWhereInput | ExercisePrimaryMuscleGroupScalarWhereInput[]
    OR?: ExercisePrimaryMuscleGroupScalarWhereInput[]
    NOT?: ExercisePrimaryMuscleGroupScalarWhereInput | ExercisePrimaryMuscleGroupScalarWhereInput[]
    exerciseId?: IntFilter<"ExercisePrimaryMuscleGroup"> | number
    muscleGroupId?: IntFilter<"ExercisePrimaryMuscleGroup"> | number
  }

  export type ExerciseSecondaryMuscleGroupUpsertWithWhereUniqueWithoutMuscleGroupInput = {
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
    update: XOR<ExerciseSecondaryMuscleGroupUpdateWithoutMuscleGroupInput, ExerciseSecondaryMuscleGroupUncheckedUpdateWithoutMuscleGroupInput>
    create: XOR<ExerciseSecondaryMuscleGroupCreateWithoutMuscleGroupInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutMuscleGroupInput>
  }

  export type ExerciseSecondaryMuscleGroupUpdateWithWhereUniqueWithoutMuscleGroupInput = {
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
    data: XOR<ExerciseSecondaryMuscleGroupUpdateWithoutMuscleGroupInput, ExerciseSecondaryMuscleGroupUncheckedUpdateWithoutMuscleGroupInput>
  }

  export type ExerciseSecondaryMuscleGroupUpdateManyWithWhereWithoutMuscleGroupInput = {
    where: ExerciseSecondaryMuscleGroupScalarWhereInput
    data: XOR<ExerciseSecondaryMuscleGroupUpdateManyMutationInput, ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupInput>
  }

  export type ExerciseSecondaryMuscleGroupScalarWhereInput = {
    AND?: ExerciseSecondaryMuscleGroupScalarWhereInput | ExerciseSecondaryMuscleGroupScalarWhereInput[]
    OR?: ExerciseSecondaryMuscleGroupScalarWhereInput[]
    NOT?: ExerciseSecondaryMuscleGroupScalarWhereInput | ExerciseSecondaryMuscleGroupScalarWhereInput[]
    exerciseId?: IntFilter<"ExerciseSecondaryMuscleGroup"> | number
    muscleGroupId?: IntFilter<"ExerciseSecondaryMuscleGroup"> | number
  }

  export type ExercisePrimaryMuscleGroupCreateWithoutExerciseInput = {
    muscleGroup: MuscleGroupCreateNestedOneWithoutPrimaryExercisesInput
  }

  export type ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput = {
    muscleGroupId: number
  }

  export type ExercisePrimaryMuscleGroupCreateOrConnectWithoutExerciseInput = {
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
    create: XOR<ExercisePrimaryMuscleGroupCreateWithoutExerciseInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput>
  }

  export type ExercisePrimaryMuscleGroupCreateManyExerciseInputEnvelope = {
    data: ExercisePrimaryMuscleGroupCreateManyExerciseInput | ExercisePrimaryMuscleGroupCreateManyExerciseInput[]
    skipDuplicates?: boolean
  }

  export type ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput = {
    muscleGroup: MuscleGroupCreateNestedOneWithoutSecondaryExercisesInput
  }

  export type ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput = {
    muscleGroupId: number
  }

  export type ExerciseSecondaryMuscleGroupCreateOrConnectWithoutExerciseInput = {
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
    create: XOR<ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput>
  }

  export type ExerciseSecondaryMuscleGroupCreateManyExerciseInputEnvelope = {
    data: ExerciseSecondaryMuscleGroupCreateManyExerciseInput | ExerciseSecondaryMuscleGroupCreateManyExerciseInput[]
    skipDuplicates?: boolean
  }

  export type ExercisePrimaryMuscleGroupUpsertWithWhereUniqueWithoutExerciseInput = {
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
    update: XOR<ExercisePrimaryMuscleGroupUpdateWithoutExerciseInput, ExercisePrimaryMuscleGroupUncheckedUpdateWithoutExerciseInput>
    create: XOR<ExercisePrimaryMuscleGroupCreateWithoutExerciseInput, ExercisePrimaryMuscleGroupUncheckedCreateWithoutExerciseInput>
  }

  export type ExercisePrimaryMuscleGroupUpdateWithWhereUniqueWithoutExerciseInput = {
    where: ExercisePrimaryMuscleGroupWhereUniqueInput
    data: XOR<ExercisePrimaryMuscleGroupUpdateWithoutExerciseInput, ExercisePrimaryMuscleGroupUncheckedUpdateWithoutExerciseInput>
  }

  export type ExercisePrimaryMuscleGroupUpdateManyWithWhereWithoutExerciseInput = {
    where: ExercisePrimaryMuscleGroupScalarWhereInput
    data: XOR<ExercisePrimaryMuscleGroupUpdateManyMutationInput, ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutExerciseInput>
  }

  export type ExerciseSecondaryMuscleGroupUpsertWithWhereUniqueWithoutExerciseInput = {
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
    update: XOR<ExerciseSecondaryMuscleGroupUpdateWithoutExerciseInput, ExerciseSecondaryMuscleGroupUncheckedUpdateWithoutExerciseInput>
    create: XOR<ExerciseSecondaryMuscleGroupCreateWithoutExerciseInput, ExerciseSecondaryMuscleGroupUncheckedCreateWithoutExerciseInput>
  }

  export type ExerciseSecondaryMuscleGroupUpdateWithWhereUniqueWithoutExerciseInput = {
    where: ExerciseSecondaryMuscleGroupWhereUniqueInput
    data: XOR<ExerciseSecondaryMuscleGroupUpdateWithoutExerciseInput, ExerciseSecondaryMuscleGroupUncheckedUpdateWithoutExerciseInput>
  }

  export type ExerciseSecondaryMuscleGroupUpdateManyWithWhereWithoutExerciseInput = {
    where: ExerciseSecondaryMuscleGroupScalarWhereInput
    data: XOR<ExerciseSecondaryMuscleGroupUpdateManyMutationInput, ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutExerciseInput>
  }

  export type ExerciseCreateWithoutPrimaryMuscleGroupsInput = {
    label: string
    recordSetsType: $Enums.RecordSetsType
    createdAt?: Date | string
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseUncheckedCreateWithoutPrimaryMuscleGroupsInput = {
    id?: number
    label: string
    recordSetsType: $Enums.RecordSetsType
    createdAt?: Date | string
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupUncheckedCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseCreateOrConnectWithoutPrimaryMuscleGroupsInput = {
    where: ExerciseWhereUniqueInput
    create: XOR<ExerciseCreateWithoutPrimaryMuscleGroupsInput, ExerciseUncheckedCreateWithoutPrimaryMuscleGroupsInput>
  }

  export type MuscleGroupCreateWithoutPrimaryExercisesInput = {
    label: $Enums.MuscleGroupLabel
    bodyArea: BodyAreaCreateNestedOneWithoutMuscleGroupsInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupCreateNestedManyWithoutMuscleGroupInput
  }

  export type MuscleGroupUncheckedCreateWithoutPrimaryExercisesInput = {
    id?: number
    label: $Enums.MuscleGroupLabel
    bodyAreaId: number
    secondaryExercises?: ExerciseSecondaryMuscleGroupUncheckedCreateNestedManyWithoutMuscleGroupInput
  }

  export type MuscleGroupCreateOrConnectWithoutPrimaryExercisesInput = {
    where: MuscleGroupWhereUniqueInput
    create: XOR<MuscleGroupCreateWithoutPrimaryExercisesInput, MuscleGroupUncheckedCreateWithoutPrimaryExercisesInput>
  }

  export type ExerciseUpsertWithoutPrimaryMuscleGroupsInput = {
    update: XOR<ExerciseUpdateWithoutPrimaryMuscleGroupsInput, ExerciseUncheckedUpdateWithoutPrimaryMuscleGroupsInput>
    create: XOR<ExerciseCreateWithoutPrimaryMuscleGroupsInput, ExerciseUncheckedCreateWithoutPrimaryMuscleGroupsInput>
    where?: ExerciseWhereInput
  }

  export type ExerciseUpdateToOneWithWhereWithoutPrimaryMuscleGroupsInput = {
    where?: ExerciseWhereInput
    data: XOR<ExerciseUpdateWithoutPrimaryMuscleGroupsInput, ExerciseUncheckedUpdateWithoutPrimaryMuscleGroupsInput>
  }

  export type ExerciseUpdateWithoutPrimaryMuscleGroupsInput = {
    label?: StringFieldUpdateOperationsInput | string
    recordSetsType?: EnumRecordSetsTypeFieldUpdateOperationsInput | $Enums.RecordSetsType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupUpdateManyWithoutExerciseNestedInput
  }

  export type ExerciseUncheckedUpdateWithoutPrimaryMuscleGroupsInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    recordSetsType?: EnumRecordSetsTypeFieldUpdateOperationsInput | $Enums.RecordSetsType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    secondaryMuscleGroups?: ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutExerciseNestedInput
  }

  export type MuscleGroupUpsertWithoutPrimaryExercisesInput = {
    update: XOR<MuscleGroupUpdateWithoutPrimaryExercisesInput, MuscleGroupUncheckedUpdateWithoutPrimaryExercisesInput>
    create: XOR<MuscleGroupCreateWithoutPrimaryExercisesInput, MuscleGroupUncheckedCreateWithoutPrimaryExercisesInput>
    where?: MuscleGroupWhereInput
  }

  export type MuscleGroupUpdateToOneWithWhereWithoutPrimaryExercisesInput = {
    where?: MuscleGroupWhereInput
    data: XOR<MuscleGroupUpdateWithoutPrimaryExercisesInput, MuscleGroupUncheckedUpdateWithoutPrimaryExercisesInput>
  }

  export type MuscleGroupUpdateWithoutPrimaryExercisesInput = {
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
    bodyArea?: BodyAreaUpdateOneRequiredWithoutMuscleGroupsNestedInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupUpdateManyWithoutMuscleGroupNestedInput
  }

  export type MuscleGroupUncheckedUpdateWithoutPrimaryExercisesInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
    bodyAreaId?: IntFieldUpdateOperationsInput | number
    secondaryExercises?: ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupNestedInput
  }

  export type ExerciseCreateWithoutSecondaryMuscleGroupsInput = {
    label: string
    recordSetsType: $Enums.RecordSetsType
    createdAt?: Date | string
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseUncheckedCreateWithoutSecondaryMuscleGroupsInput = {
    id?: number
    label: string
    recordSetsType: $Enums.RecordSetsType
    createdAt?: Date | string
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupUncheckedCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseCreateOrConnectWithoutSecondaryMuscleGroupsInput = {
    where: ExerciseWhereUniqueInput
    create: XOR<ExerciseCreateWithoutSecondaryMuscleGroupsInput, ExerciseUncheckedCreateWithoutSecondaryMuscleGroupsInput>
  }

  export type MuscleGroupCreateWithoutSecondaryExercisesInput = {
    label: $Enums.MuscleGroupLabel
    bodyArea: BodyAreaCreateNestedOneWithoutMuscleGroupsInput
    primaryExercises?: ExercisePrimaryMuscleGroupCreateNestedManyWithoutMuscleGroupInput
  }

  export type MuscleGroupUncheckedCreateWithoutSecondaryExercisesInput = {
    id?: number
    label: $Enums.MuscleGroupLabel
    bodyAreaId: number
    primaryExercises?: ExercisePrimaryMuscleGroupUncheckedCreateNestedManyWithoutMuscleGroupInput
  }

  export type MuscleGroupCreateOrConnectWithoutSecondaryExercisesInput = {
    where: MuscleGroupWhereUniqueInput
    create: XOR<MuscleGroupCreateWithoutSecondaryExercisesInput, MuscleGroupUncheckedCreateWithoutSecondaryExercisesInput>
  }

  export type ExerciseUpsertWithoutSecondaryMuscleGroupsInput = {
    update: XOR<ExerciseUpdateWithoutSecondaryMuscleGroupsInput, ExerciseUncheckedUpdateWithoutSecondaryMuscleGroupsInput>
    create: XOR<ExerciseCreateWithoutSecondaryMuscleGroupsInput, ExerciseUncheckedCreateWithoutSecondaryMuscleGroupsInput>
    where?: ExerciseWhereInput
  }

  export type ExerciseUpdateToOneWithWhereWithoutSecondaryMuscleGroupsInput = {
    where?: ExerciseWhereInput
    data: XOR<ExerciseUpdateWithoutSecondaryMuscleGroupsInput, ExerciseUncheckedUpdateWithoutSecondaryMuscleGroupsInput>
  }

  export type ExerciseUpdateWithoutSecondaryMuscleGroupsInput = {
    label?: StringFieldUpdateOperationsInput | string
    recordSetsType?: EnumRecordSetsTypeFieldUpdateOperationsInput | $Enums.RecordSetsType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupUpdateManyWithoutExerciseNestedInput
  }

  export type ExerciseUncheckedUpdateWithoutSecondaryMuscleGroupsInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    recordSetsType?: EnumRecordSetsTypeFieldUpdateOperationsInput | $Enums.RecordSetsType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    primaryMuscleGroups?: ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutExerciseNestedInput
  }

  export type MuscleGroupUpsertWithoutSecondaryExercisesInput = {
    update: XOR<MuscleGroupUpdateWithoutSecondaryExercisesInput, MuscleGroupUncheckedUpdateWithoutSecondaryExercisesInput>
    create: XOR<MuscleGroupCreateWithoutSecondaryExercisesInput, MuscleGroupUncheckedCreateWithoutSecondaryExercisesInput>
    where?: MuscleGroupWhereInput
  }

  export type MuscleGroupUpdateToOneWithWhereWithoutSecondaryExercisesInput = {
    where?: MuscleGroupWhereInput
    data: XOR<MuscleGroupUpdateWithoutSecondaryExercisesInput, MuscleGroupUncheckedUpdateWithoutSecondaryExercisesInput>
  }

  export type MuscleGroupUpdateWithoutSecondaryExercisesInput = {
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
    bodyArea?: BodyAreaUpdateOneRequiredWithoutMuscleGroupsNestedInput
    primaryExercises?: ExercisePrimaryMuscleGroupUpdateManyWithoutMuscleGroupNestedInput
  }

  export type MuscleGroupUncheckedUpdateWithoutSecondaryExercisesInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
    bodyAreaId?: IntFieldUpdateOperationsInput | number
    primaryExercises?: ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupNestedInput
  }

  export type MuscleGroupCreateManyBodyAreaInput = {
    id?: number
    label: $Enums.MuscleGroupLabel
  }

  export type MuscleGroupUpdateWithoutBodyAreaInput = {
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
    primaryExercises?: ExercisePrimaryMuscleGroupUpdateManyWithoutMuscleGroupNestedInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupUpdateManyWithoutMuscleGroupNestedInput
  }

  export type MuscleGroupUncheckedUpdateWithoutBodyAreaInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
    primaryExercises?: ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupNestedInput
    secondaryExercises?: ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupNestedInput
  }

  export type MuscleGroupUncheckedUpdateManyWithoutBodyAreaInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: EnumMuscleGroupLabelFieldUpdateOperationsInput | $Enums.MuscleGroupLabel
  }

  export type ExercisePrimaryMuscleGroupCreateManyMuscleGroupInput = {
    exerciseId: number
  }

  export type ExerciseSecondaryMuscleGroupCreateManyMuscleGroupInput = {
    exerciseId: number
  }

  export type ExercisePrimaryMuscleGroupUpdateWithoutMuscleGroupInput = {
    exercise?: ExerciseUpdateOneRequiredWithoutPrimaryMuscleGroupsNestedInput
  }

  export type ExercisePrimaryMuscleGroupUncheckedUpdateWithoutMuscleGroupInput = {
    exerciseId?: IntFieldUpdateOperationsInput | number
  }

  export type ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupInput = {
    exerciseId?: IntFieldUpdateOperationsInput | number
  }

  export type ExerciseSecondaryMuscleGroupUpdateWithoutMuscleGroupInput = {
    exercise?: ExerciseUpdateOneRequiredWithoutSecondaryMuscleGroupsNestedInput
  }

  export type ExerciseSecondaryMuscleGroupUncheckedUpdateWithoutMuscleGroupInput = {
    exerciseId?: IntFieldUpdateOperationsInput | number
  }

  export type ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutMuscleGroupInput = {
    exerciseId?: IntFieldUpdateOperationsInput | number
  }

  export type ExercisePrimaryMuscleGroupCreateManyExerciseInput = {
    muscleGroupId: number
  }

  export type ExerciseSecondaryMuscleGroupCreateManyExerciseInput = {
    muscleGroupId: number
  }

  export type ExercisePrimaryMuscleGroupUpdateWithoutExerciseInput = {
    muscleGroup?: MuscleGroupUpdateOneRequiredWithoutPrimaryExercisesNestedInput
  }

  export type ExercisePrimaryMuscleGroupUncheckedUpdateWithoutExerciseInput = {
    muscleGroupId?: IntFieldUpdateOperationsInput | number
  }

  export type ExercisePrimaryMuscleGroupUncheckedUpdateManyWithoutExerciseInput = {
    muscleGroupId?: IntFieldUpdateOperationsInput | number
  }

  export type ExerciseSecondaryMuscleGroupUpdateWithoutExerciseInput = {
    muscleGroup?: MuscleGroupUpdateOneRequiredWithoutSecondaryExercisesNestedInput
  }

  export type ExerciseSecondaryMuscleGroupUncheckedUpdateWithoutExerciseInput = {
    muscleGroupId?: IntFieldUpdateOperationsInput | number
  }

  export type ExerciseSecondaryMuscleGroupUncheckedUpdateManyWithoutExerciseInput = {
    muscleGroupId?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}