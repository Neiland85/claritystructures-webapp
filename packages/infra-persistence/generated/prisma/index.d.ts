
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
 * Model ContactIntake
 * 
 */
export type ContactIntake = $Result.DefaultSelection<Prisma.$ContactIntakePayload>
/**
 * Model ConsentVersion
 * 
 */
export type ConsentVersion = $Result.DefaultSelection<Prisma.$ConsentVersionPayload>
/**
 * Model ConsentAcceptance
 * 
 */
export type ConsentAcceptance = $Result.DefaultSelection<Prisma.$ConsentAcceptancePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const IntakeTone: {
  basic: 'basic',
  family: 'family',
  legal: 'legal',
  critical: 'critical'
};

export type IntakeTone = (typeof IntakeTone)[keyof typeof IntakeTone]


export const IntakePriority: {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical'
};

export type IntakePriority = (typeof IntakePriority)[keyof typeof IntakePriority]


export const IntakeStatus: {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected'
};

export type IntakeStatus = (typeof IntakeStatus)[keyof typeof IntakeStatus]

}

export type IntakeTone = $Enums.IntakeTone

export const IntakeTone: typeof $Enums.IntakeTone

export type IntakePriority = $Enums.IntakePriority

export const IntakePriority: typeof $Enums.IntakePriority

export type IntakeStatus = $Enums.IntakeStatus

export const IntakeStatus: typeof $Enums.IntakeStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ContactIntakes
 * const contactIntakes = await prisma.contactIntake.findMany()
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
   * // Fetch zero or more ContactIntakes
   * const contactIntakes = await prisma.contactIntake.findMany()
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
   * `prisma.contactIntake`: Exposes CRUD operations for the **ContactIntake** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContactIntakes
    * const contactIntakes = await prisma.contactIntake.findMany()
    * ```
    */
  get contactIntake(): Prisma.ContactIntakeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.consentVersion`: Exposes CRUD operations for the **ConsentVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConsentVersions
    * const consentVersions = await prisma.consentVersion.findMany()
    * ```
    */
  get consentVersion(): Prisma.ConsentVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.consentAcceptance`: Exposes CRUD operations for the **ConsentAcceptance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConsentAcceptances
    * const consentAcceptances = await prisma.consentAcceptance.findMany()
    * ```
    */
  get consentAcceptance(): Prisma.ConsentAcceptanceDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 7.4.0
   * Query Engine version: ab56fe763f921d033a6c195e7ddeb3e255bdbb57
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
    ContactIntake: 'ContactIntake',
    ConsentVersion: 'ConsentVersion',
    ConsentAcceptance: 'ConsentAcceptance'
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
      modelProps: "contactIntake" | "consentVersion" | "consentAcceptance"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ContactIntake: {
        payload: Prisma.$ContactIntakePayload<ExtArgs>
        fields: Prisma.ContactIntakeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContactIntakeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContactIntakeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload>
          }
          findFirst: {
            args: Prisma.ContactIntakeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContactIntakeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload>
          }
          findMany: {
            args: Prisma.ContactIntakeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload>[]
          }
          create: {
            args: Prisma.ContactIntakeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload>
          }
          createMany: {
            args: Prisma.ContactIntakeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContactIntakeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload>[]
          }
          delete: {
            args: Prisma.ContactIntakeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload>
          }
          update: {
            args: Prisma.ContactIntakeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload>
          }
          deleteMany: {
            args: Prisma.ContactIntakeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContactIntakeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContactIntakeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload>[]
          }
          upsert: {
            args: Prisma.ContactIntakeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactIntakePayload>
          }
          aggregate: {
            args: Prisma.ContactIntakeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContactIntake>
          }
          groupBy: {
            args: Prisma.ContactIntakeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContactIntakeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContactIntakeCountArgs<ExtArgs>
            result: $Utils.Optional<ContactIntakeCountAggregateOutputType> | number
          }
        }
      }
      ConsentVersion: {
        payload: Prisma.$ConsentVersionPayload<ExtArgs>
        fields: Prisma.ConsentVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConsentVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConsentVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload>
          }
          findFirst: {
            args: Prisma.ConsentVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConsentVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload>
          }
          findMany: {
            args: Prisma.ConsentVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload>[]
          }
          create: {
            args: Prisma.ConsentVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload>
          }
          createMany: {
            args: Prisma.ConsentVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConsentVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload>[]
          }
          delete: {
            args: Prisma.ConsentVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload>
          }
          update: {
            args: Prisma.ConsentVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload>
          }
          deleteMany: {
            args: Prisma.ConsentVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConsentVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConsentVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload>[]
          }
          upsert: {
            args: Prisma.ConsentVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentVersionPayload>
          }
          aggregate: {
            args: Prisma.ConsentVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConsentVersion>
          }
          groupBy: {
            args: Prisma.ConsentVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConsentVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConsentVersionCountArgs<ExtArgs>
            result: $Utils.Optional<ConsentVersionCountAggregateOutputType> | number
          }
        }
      }
      ConsentAcceptance: {
        payload: Prisma.$ConsentAcceptancePayload<ExtArgs>
        fields: Prisma.ConsentAcceptanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConsentAcceptanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConsentAcceptanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload>
          }
          findFirst: {
            args: Prisma.ConsentAcceptanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConsentAcceptanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload>
          }
          findMany: {
            args: Prisma.ConsentAcceptanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload>[]
          }
          create: {
            args: Prisma.ConsentAcceptanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload>
          }
          createMany: {
            args: Prisma.ConsentAcceptanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConsentAcceptanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload>[]
          }
          delete: {
            args: Prisma.ConsentAcceptanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload>
          }
          update: {
            args: Prisma.ConsentAcceptanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload>
          }
          deleteMany: {
            args: Prisma.ConsentAcceptanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConsentAcceptanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConsentAcceptanceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload>[]
          }
          upsert: {
            args: Prisma.ConsentAcceptanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentAcceptancePayload>
          }
          aggregate: {
            args: Prisma.ConsentAcceptanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConsentAcceptance>
          }
          groupBy: {
            args: Prisma.ConsentAcceptanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConsentAcceptanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConsentAcceptanceCountArgs<ExtArgs>
            result: $Utils.Optional<ConsentAcceptanceCountAggregateOutputType> | number
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
    contactIntake?: ContactIntakeOmit
    consentVersion?: ConsentVersionOmit
    consentAcceptance?: ConsentAcceptanceOmit
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
   * Count Type ContactIntakeCountOutputType
   */

  export type ContactIntakeCountOutputType = {
    consentAcceptances: number
  }

  export type ContactIntakeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    consentAcceptances?: boolean | ContactIntakeCountOutputTypeCountConsentAcceptancesArgs
  }

  // Custom InputTypes
  /**
   * ContactIntakeCountOutputType without action
   */
  export type ContactIntakeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntakeCountOutputType
     */
    select?: ContactIntakeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContactIntakeCountOutputType without action
   */
  export type ContactIntakeCountOutputTypeCountConsentAcceptancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentAcceptanceWhereInput
  }


  /**
   * Count Type ConsentVersionCountOutputType
   */

  export type ConsentVersionCountOutputType = {
    acceptances: number
  }

  export type ConsentVersionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    acceptances?: boolean | ConsentVersionCountOutputTypeCountAcceptancesArgs
  }

  // Custom InputTypes
  /**
   * ConsentVersionCountOutputType without action
   */
  export type ConsentVersionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersionCountOutputType
     */
    select?: ConsentVersionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConsentVersionCountOutputType without action
   */
  export type ConsentVersionCountOutputTypeCountAcceptancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentAcceptanceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ContactIntake
   */

  export type AggregateContactIntake = {
    _count: ContactIntakeCountAggregateOutputType | null
    _avg: ContactIntakeAvgAggregateOutputType | null
    _sum: ContactIntakeSumAggregateOutputType | null
    _min: ContactIntakeMinAggregateOutputType | null
    _max: ContactIntakeMaxAggregateOutputType | null
  }

  export type ContactIntakeAvgAggregateOutputType = {
    spamScore: number | null
  }

  export type ContactIntakeSumAggregateOutputType = {
    spamScore: number | null
  }

  export type ContactIntakeMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    tone: $Enums.IntakeTone | null
    route: string | null
    priority: $Enums.IntakePriority | null
    name: string | null
    email: string | null
    message: string | null
    phone: string | null
    status: $Enums.IntakeStatus | null
    spamScore: number | null
  }

  export type ContactIntakeMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    tone: $Enums.IntakeTone | null
    route: string | null
    priority: $Enums.IntakePriority | null
    name: string | null
    email: string | null
    message: string | null
    phone: string | null
    status: $Enums.IntakeStatus | null
    spamScore: number | null
  }

  export type ContactIntakeCountAggregateOutputType = {
    id: number
    createdAt: number
    tone: number
    route: number
    priority: number
    name: number
    email: number
    message: number
    phone: number
    status: number
    spamScore: number
    meta: number
    _all: number
  }


  export type ContactIntakeAvgAggregateInputType = {
    spamScore?: true
  }

  export type ContactIntakeSumAggregateInputType = {
    spamScore?: true
  }

  export type ContactIntakeMinAggregateInputType = {
    id?: true
    createdAt?: true
    tone?: true
    route?: true
    priority?: true
    name?: true
    email?: true
    message?: true
    phone?: true
    status?: true
    spamScore?: true
  }

  export type ContactIntakeMaxAggregateInputType = {
    id?: true
    createdAt?: true
    tone?: true
    route?: true
    priority?: true
    name?: true
    email?: true
    message?: true
    phone?: true
    status?: true
    spamScore?: true
  }

  export type ContactIntakeCountAggregateInputType = {
    id?: true
    createdAt?: true
    tone?: true
    route?: true
    priority?: true
    name?: true
    email?: true
    message?: true
    phone?: true
    status?: true
    spamScore?: true
    meta?: true
    _all?: true
  }

  export type ContactIntakeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactIntake to aggregate.
     */
    where?: ContactIntakeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactIntakes to fetch.
     */
    orderBy?: ContactIntakeOrderByWithRelationInput | ContactIntakeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContactIntakeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactIntakes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactIntakes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContactIntakes
    **/
    _count?: true | ContactIntakeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContactIntakeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContactIntakeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContactIntakeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContactIntakeMaxAggregateInputType
  }

  export type GetContactIntakeAggregateType<T extends ContactIntakeAggregateArgs> = {
        [P in keyof T & keyof AggregateContactIntake]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContactIntake[P]>
      : GetScalarType<T[P], AggregateContactIntake[P]>
  }




  export type ContactIntakeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactIntakeWhereInput
    orderBy?: ContactIntakeOrderByWithAggregationInput | ContactIntakeOrderByWithAggregationInput[]
    by: ContactIntakeScalarFieldEnum[] | ContactIntakeScalarFieldEnum
    having?: ContactIntakeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContactIntakeCountAggregateInputType | true
    _avg?: ContactIntakeAvgAggregateInputType
    _sum?: ContactIntakeSumAggregateInputType
    _min?: ContactIntakeMinAggregateInputType
    _max?: ContactIntakeMaxAggregateInputType
  }

  export type ContactIntakeGroupByOutputType = {
    id: string
    createdAt: Date
    tone: $Enums.IntakeTone
    route: string
    priority: $Enums.IntakePriority
    name: string | null
    email: string
    message: string
    phone: string | null
    status: $Enums.IntakeStatus
    spamScore: number | null
    meta: JsonValue | null
    _count: ContactIntakeCountAggregateOutputType | null
    _avg: ContactIntakeAvgAggregateOutputType | null
    _sum: ContactIntakeSumAggregateOutputType | null
    _min: ContactIntakeMinAggregateOutputType | null
    _max: ContactIntakeMaxAggregateOutputType | null
  }

  type GetContactIntakeGroupByPayload<T extends ContactIntakeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContactIntakeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContactIntakeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContactIntakeGroupByOutputType[P]>
            : GetScalarType<T[P], ContactIntakeGroupByOutputType[P]>
        }
      >
    >


  export type ContactIntakeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    tone?: boolean
    route?: boolean
    priority?: boolean
    name?: boolean
    email?: boolean
    message?: boolean
    phone?: boolean
    status?: boolean
    spamScore?: boolean
    meta?: boolean
    consentAcceptances?: boolean | ContactIntake$consentAcceptancesArgs<ExtArgs>
    _count?: boolean | ContactIntakeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contactIntake"]>

  export type ContactIntakeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    tone?: boolean
    route?: boolean
    priority?: boolean
    name?: boolean
    email?: boolean
    message?: boolean
    phone?: boolean
    status?: boolean
    spamScore?: boolean
    meta?: boolean
  }, ExtArgs["result"]["contactIntake"]>

  export type ContactIntakeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    tone?: boolean
    route?: boolean
    priority?: boolean
    name?: boolean
    email?: boolean
    message?: boolean
    phone?: boolean
    status?: boolean
    spamScore?: boolean
    meta?: boolean
  }, ExtArgs["result"]["contactIntake"]>

  export type ContactIntakeSelectScalar = {
    id?: boolean
    createdAt?: boolean
    tone?: boolean
    route?: boolean
    priority?: boolean
    name?: boolean
    email?: boolean
    message?: boolean
    phone?: boolean
    status?: boolean
    spamScore?: boolean
    meta?: boolean
  }

  export type ContactIntakeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "tone" | "route" | "priority" | "name" | "email" | "message" | "phone" | "status" | "spamScore" | "meta", ExtArgs["result"]["contactIntake"]>
  export type ContactIntakeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    consentAcceptances?: boolean | ContactIntake$consentAcceptancesArgs<ExtArgs>
    _count?: boolean | ContactIntakeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ContactIntakeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ContactIntakeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ContactIntakePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContactIntake"
    objects: {
      consentAcceptances: Prisma.$ConsentAcceptancePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      tone: $Enums.IntakeTone
      route: string
      priority: $Enums.IntakePriority
      name: string | null
      email: string
      message: string
      phone: string | null
      status: $Enums.IntakeStatus
      spamScore: number | null
      meta: Prisma.JsonValue | null
    }, ExtArgs["result"]["contactIntake"]>
    composites: {}
  }

  type ContactIntakeGetPayload<S extends boolean | null | undefined | ContactIntakeDefaultArgs> = $Result.GetResult<Prisma.$ContactIntakePayload, S>

  type ContactIntakeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContactIntakeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContactIntakeCountAggregateInputType | true
    }

  export interface ContactIntakeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContactIntake'], meta: { name: 'ContactIntake' } }
    /**
     * Find zero or one ContactIntake that matches the filter.
     * @param {ContactIntakeFindUniqueArgs} args - Arguments to find a ContactIntake
     * @example
     * // Get one ContactIntake
     * const contactIntake = await prisma.contactIntake.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactIntakeFindUniqueArgs>(args: SelectSubset<T, ContactIntakeFindUniqueArgs<ExtArgs>>): Prisma__ContactIntakeClient<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContactIntake that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContactIntakeFindUniqueOrThrowArgs} args - Arguments to find a ContactIntake
     * @example
     * // Get one ContactIntake
     * const contactIntake = await prisma.contactIntake.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactIntakeFindUniqueOrThrowArgs>(args: SelectSubset<T, ContactIntakeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContactIntakeClient<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactIntake that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactIntakeFindFirstArgs} args - Arguments to find a ContactIntake
     * @example
     * // Get one ContactIntake
     * const contactIntake = await prisma.contactIntake.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactIntakeFindFirstArgs>(args?: SelectSubset<T, ContactIntakeFindFirstArgs<ExtArgs>>): Prisma__ContactIntakeClient<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactIntake that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactIntakeFindFirstOrThrowArgs} args - Arguments to find a ContactIntake
     * @example
     * // Get one ContactIntake
     * const contactIntake = await prisma.contactIntake.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactIntakeFindFirstOrThrowArgs>(args?: SelectSubset<T, ContactIntakeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContactIntakeClient<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContactIntakes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactIntakeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContactIntakes
     * const contactIntakes = await prisma.contactIntake.findMany()
     * 
     * // Get first 10 ContactIntakes
     * const contactIntakes = await prisma.contactIntake.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contactIntakeWithIdOnly = await prisma.contactIntake.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContactIntakeFindManyArgs>(args?: SelectSubset<T, ContactIntakeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContactIntake.
     * @param {ContactIntakeCreateArgs} args - Arguments to create a ContactIntake.
     * @example
     * // Create one ContactIntake
     * const ContactIntake = await prisma.contactIntake.create({
     *   data: {
     *     // ... data to create a ContactIntake
     *   }
     * })
     * 
     */
    create<T extends ContactIntakeCreateArgs>(args: SelectSubset<T, ContactIntakeCreateArgs<ExtArgs>>): Prisma__ContactIntakeClient<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContactIntakes.
     * @param {ContactIntakeCreateManyArgs} args - Arguments to create many ContactIntakes.
     * @example
     * // Create many ContactIntakes
     * const contactIntake = await prisma.contactIntake.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContactIntakeCreateManyArgs>(args?: SelectSubset<T, ContactIntakeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContactIntakes and returns the data saved in the database.
     * @param {ContactIntakeCreateManyAndReturnArgs} args - Arguments to create many ContactIntakes.
     * @example
     * // Create many ContactIntakes
     * const contactIntake = await prisma.contactIntake.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContactIntakes and only return the `id`
     * const contactIntakeWithIdOnly = await prisma.contactIntake.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContactIntakeCreateManyAndReturnArgs>(args?: SelectSubset<T, ContactIntakeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContactIntake.
     * @param {ContactIntakeDeleteArgs} args - Arguments to delete one ContactIntake.
     * @example
     * // Delete one ContactIntake
     * const ContactIntake = await prisma.contactIntake.delete({
     *   where: {
     *     // ... filter to delete one ContactIntake
     *   }
     * })
     * 
     */
    delete<T extends ContactIntakeDeleteArgs>(args: SelectSubset<T, ContactIntakeDeleteArgs<ExtArgs>>): Prisma__ContactIntakeClient<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContactIntake.
     * @param {ContactIntakeUpdateArgs} args - Arguments to update one ContactIntake.
     * @example
     * // Update one ContactIntake
     * const contactIntake = await prisma.contactIntake.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContactIntakeUpdateArgs>(args: SelectSubset<T, ContactIntakeUpdateArgs<ExtArgs>>): Prisma__ContactIntakeClient<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContactIntakes.
     * @param {ContactIntakeDeleteManyArgs} args - Arguments to filter ContactIntakes to delete.
     * @example
     * // Delete a few ContactIntakes
     * const { count } = await prisma.contactIntake.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContactIntakeDeleteManyArgs>(args?: SelectSubset<T, ContactIntakeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactIntakes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactIntakeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContactIntakes
     * const contactIntake = await prisma.contactIntake.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContactIntakeUpdateManyArgs>(args: SelectSubset<T, ContactIntakeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactIntakes and returns the data updated in the database.
     * @param {ContactIntakeUpdateManyAndReturnArgs} args - Arguments to update many ContactIntakes.
     * @example
     * // Update many ContactIntakes
     * const contactIntake = await prisma.contactIntake.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContactIntakes and only return the `id`
     * const contactIntakeWithIdOnly = await prisma.contactIntake.updateManyAndReturn({
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
    updateManyAndReturn<T extends ContactIntakeUpdateManyAndReturnArgs>(args: SelectSubset<T, ContactIntakeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContactIntake.
     * @param {ContactIntakeUpsertArgs} args - Arguments to update or create a ContactIntake.
     * @example
     * // Update or create a ContactIntake
     * const contactIntake = await prisma.contactIntake.upsert({
     *   create: {
     *     // ... data to create a ContactIntake
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContactIntake we want to update
     *   }
     * })
     */
    upsert<T extends ContactIntakeUpsertArgs>(args: SelectSubset<T, ContactIntakeUpsertArgs<ExtArgs>>): Prisma__ContactIntakeClient<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContactIntakes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactIntakeCountArgs} args - Arguments to filter ContactIntakes to count.
     * @example
     * // Count the number of ContactIntakes
     * const count = await prisma.contactIntake.count({
     *   where: {
     *     // ... the filter for the ContactIntakes we want to count
     *   }
     * })
    **/
    count<T extends ContactIntakeCountArgs>(
      args?: Subset<T, ContactIntakeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContactIntakeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContactIntake.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactIntakeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ContactIntakeAggregateArgs>(args: Subset<T, ContactIntakeAggregateArgs>): Prisma.PrismaPromise<GetContactIntakeAggregateType<T>>

    /**
     * Group by ContactIntake.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactIntakeGroupByArgs} args - Group by arguments.
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
      T extends ContactIntakeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContactIntakeGroupByArgs['orderBy'] }
        : { orderBy?: ContactIntakeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ContactIntakeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactIntakeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContactIntake model
   */
  readonly fields: ContactIntakeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContactIntake.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContactIntakeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    consentAcceptances<T extends ContactIntake$consentAcceptancesArgs<ExtArgs> = {}>(args?: Subset<T, ContactIntake$consentAcceptancesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ContactIntake model
   */
  interface ContactIntakeFieldRefs {
    readonly id: FieldRef<"ContactIntake", 'String'>
    readonly createdAt: FieldRef<"ContactIntake", 'DateTime'>
    readonly tone: FieldRef<"ContactIntake", 'IntakeTone'>
    readonly route: FieldRef<"ContactIntake", 'String'>
    readonly priority: FieldRef<"ContactIntake", 'IntakePriority'>
    readonly name: FieldRef<"ContactIntake", 'String'>
    readonly email: FieldRef<"ContactIntake", 'String'>
    readonly message: FieldRef<"ContactIntake", 'String'>
    readonly phone: FieldRef<"ContactIntake", 'String'>
    readonly status: FieldRef<"ContactIntake", 'IntakeStatus'>
    readonly spamScore: FieldRef<"ContactIntake", 'Float'>
    readonly meta: FieldRef<"ContactIntake", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * ContactIntake findUnique
   */
  export type ContactIntakeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIntakeInclude<ExtArgs> | null
    /**
     * Filter, which ContactIntake to fetch.
     */
    where: ContactIntakeWhereUniqueInput
  }

  /**
   * ContactIntake findUniqueOrThrow
   */
  export type ContactIntakeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIntakeInclude<ExtArgs> | null
    /**
     * Filter, which ContactIntake to fetch.
     */
    where: ContactIntakeWhereUniqueInput
  }

  /**
   * ContactIntake findFirst
   */
  export type ContactIntakeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIntakeInclude<ExtArgs> | null
    /**
     * Filter, which ContactIntake to fetch.
     */
    where?: ContactIntakeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactIntakes to fetch.
     */
    orderBy?: ContactIntakeOrderByWithRelationInput | ContactIntakeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactIntakes.
     */
    cursor?: ContactIntakeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactIntakes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactIntakes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactIntakes.
     */
    distinct?: ContactIntakeScalarFieldEnum | ContactIntakeScalarFieldEnum[]
  }

  /**
   * ContactIntake findFirstOrThrow
   */
  export type ContactIntakeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIntakeInclude<ExtArgs> | null
    /**
     * Filter, which ContactIntake to fetch.
     */
    where?: ContactIntakeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactIntakes to fetch.
     */
    orderBy?: ContactIntakeOrderByWithRelationInput | ContactIntakeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactIntakes.
     */
    cursor?: ContactIntakeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactIntakes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactIntakes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactIntakes.
     */
    distinct?: ContactIntakeScalarFieldEnum | ContactIntakeScalarFieldEnum[]
  }

  /**
   * ContactIntake findMany
   */
  export type ContactIntakeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIntakeInclude<ExtArgs> | null
    /**
     * Filter, which ContactIntakes to fetch.
     */
    where?: ContactIntakeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactIntakes to fetch.
     */
    orderBy?: ContactIntakeOrderByWithRelationInput | ContactIntakeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContactIntakes.
     */
    cursor?: ContactIntakeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactIntakes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactIntakes.
     */
    skip?: number
    distinct?: ContactIntakeScalarFieldEnum | ContactIntakeScalarFieldEnum[]
  }

  /**
   * ContactIntake create
   */
  export type ContactIntakeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIntakeInclude<ExtArgs> | null
    /**
     * The data needed to create a ContactIntake.
     */
    data: XOR<ContactIntakeCreateInput, ContactIntakeUncheckedCreateInput>
  }

  /**
   * ContactIntake createMany
   */
  export type ContactIntakeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContactIntakes.
     */
    data: ContactIntakeCreateManyInput | ContactIntakeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContactIntake createManyAndReturn
   */
  export type ContactIntakeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * The data used to create many ContactIntakes.
     */
    data: ContactIntakeCreateManyInput | ContactIntakeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContactIntake update
   */
  export type ContactIntakeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIntakeInclude<ExtArgs> | null
    /**
     * The data needed to update a ContactIntake.
     */
    data: XOR<ContactIntakeUpdateInput, ContactIntakeUncheckedUpdateInput>
    /**
     * Choose, which ContactIntake to update.
     */
    where: ContactIntakeWhereUniqueInput
  }

  /**
   * ContactIntake updateMany
   */
  export type ContactIntakeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContactIntakes.
     */
    data: XOR<ContactIntakeUpdateManyMutationInput, ContactIntakeUncheckedUpdateManyInput>
    /**
     * Filter which ContactIntakes to update
     */
    where?: ContactIntakeWhereInput
    /**
     * Limit how many ContactIntakes to update.
     */
    limit?: number
  }

  /**
   * ContactIntake updateManyAndReturn
   */
  export type ContactIntakeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * The data used to update ContactIntakes.
     */
    data: XOR<ContactIntakeUpdateManyMutationInput, ContactIntakeUncheckedUpdateManyInput>
    /**
     * Filter which ContactIntakes to update
     */
    where?: ContactIntakeWhereInput
    /**
     * Limit how many ContactIntakes to update.
     */
    limit?: number
  }

  /**
   * ContactIntake upsert
   */
  export type ContactIntakeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIntakeInclude<ExtArgs> | null
    /**
     * The filter to search for the ContactIntake to update in case it exists.
     */
    where: ContactIntakeWhereUniqueInput
    /**
     * In case the ContactIntake found by the `where` argument doesn't exist, create a new ContactIntake with this data.
     */
    create: XOR<ContactIntakeCreateInput, ContactIntakeUncheckedCreateInput>
    /**
     * In case the ContactIntake was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContactIntakeUpdateInput, ContactIntakeUncheckedUpdateInput>
  }

  /**
   * ContactIntake delete
   */
  export type ContactIntakeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIntakeInclude<ExtArgs> | null
    /**
     * Filter which ContactIntake to delete.
     */
    where: ContactIntakeWhereUniqueInput
  }

  /**
   * ContactIntake deleteMany
   */
  export type ContactIntakeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactIntakes to delete
     */
    where?: ContactIntakeWhereInput
    /**
     * Limit how many ContactIntakes to delete.
     */
    limit?: number
  }

  /**
   * ContactIntake.consentAcceptances
   */
  export type ContactIntake$consentAcceptancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    where?: ConsentAcceptanceWhereInput
    orderBy?: ConsentAcceptanceOrderByWithRelationInput | ConsentAcceptanceOrderByWithRelationInput[]
    cursor?: ConsentAcceptanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConsentAcceptanceScalarFieldEnum | ConsentAcceptanceScalarFieldEnum[]
  }

  /**
   * ContactIntake without action
   */
  export type ContactIntakeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactIntake
     */
    select?: ContactIntakeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactIntake
     */
    omit?: ContactIntakeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIntakeInclude<ExtArgs> | null
  }


  /**
   * Model ConsentVersion
   */

  export type AggregateConsentVersion = {
    _count: ConsentVersionCountAggregateOutputType | null
    _min: ConsentVersionMinAggregateOutputType | null
    _max: ConsentVersionMaxAggregateOutputType | null
  }

  export type ConsentVersionMinAggregateOutputType = {
    id: string | null
    version: string | null
    content: string | null
    checksumSha256: string | null
    createdAt: Date | null
    isActive: boolean | null
  }

  export type ConsentVersionMaxAggregateOutputType = {
    id: string | null
    version: string | null
    content: string | null
    checksumSha256: string | null
    createdAt: Date | null
    isActive: boolean | null
  }

  export type ConsentVersionCountAggregateOutputType = {
    id: number
    version: number
    content: number
    checksumSha256: number
    createdAt: number
    isActive: number
    _all: number
  }


  export type ConsentVersionMinAggregateInputType = {
    id?: true
    version?: true
    content?: true
    checksumSha256?: true
    createdAt?: true
    isActive?: true
  }

  export type ConsentVersionMaxAggregateInputType = {
    id?: true
    version?: true
    content?: true
    checksumSha256?: true
    createdAt?: true
    isActive?: true
  }

  export type ConsentVersionCountAggregateInputType = {
    id?: true
    version?: true
    content?: true
    checksumSha256?: true
    createdAt?: true
    isActive?: true
    _all?: true
  }

  export type ConsentVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentVersion to aggregate.
     */
    where?: ConsentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentVersions to fetch.
     */
    orderBy?: ConsentVersionOrderByWithRelationInput | ConsentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConsentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConsentVersions
    **/
    _count?: true | ConsentVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConsentVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConsentVersionMaxAggregateInputType
  }

  export type GetConsentVersionAggregateType<T extends ConsentVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateConsentVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConsentVersion[P]>
      : GetScalarType<T[P], AggregateConsentVersion[P]>
  }




  export type ConsentVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentVersionWhereInput
    orderBy?: ConsentVersionOrderByWithAggregationInput | ConsentVersionOrderByWithAggregationInput[]
    by: ConsentVersionScalarFieldEnum[] | ConsentVersionScalarFieldEnum
    having?: ConsentVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConsentVersionCountAggregateInputType | true
    _min?: ConsentVersionMinAggregateInputType
    _max?: ConsentVersionMaxAggregateInputType
  }

  export type ConsentVersionGroupByOutputType = {
    id: string
    version: string
    content: string
    checksumSha256: string
    createdAt: Date
    isActive: boolean
    _count: ConsentVersionCountAggregateOutputType | null
    _min: ConsentVersionMinAggregateOutputType | null
    _max: ConsentVersionMaxAggregateOutputType | null
  }

  type GetConsentVersionGroupByPayload<T extends ConsentVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConsentVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConsentVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConsentVersionGroupByOutputType[P]>
            : GetScalarType<T[P], ConsentVersionGroupByOutputType[P]>
        }
      >
    >


  export type ConsentVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    version?: boolean
    content?: boolean
    checksumSha256?: boolean
    createdAt?: boolean
    isActive?: boolean
    acceptances?: boolean | ConsentVersion$acceptancesArgs<ExtArgs>
    _count?: boolean | ConsentVersionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentVersion"]>

  export type ConsentVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    version?: boolean
    content?: boolean
    checksumSha256?: boolean
    createdAt?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["consentVersion"]>

  export type ConsentVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    version?: boolean
    content?: boolean
    checksumSha256?: boolean
    createdAt?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["consentVersion"]>

  export type ConsentVersionSelectScalar = {
    id?: boolean
    version?: boolean
    content?: boolean
    checksumSha256?: boolean
    createdAt?: boolean
    isActive?: boolean
  }

  export type ConsentVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "version" | "content" | "checksumSha256" | "createdAt" | "isActive", ExtArgs["result"]["consentVersion"]>
  export type ConsentVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    acceptances?: boolean | ConsentVersion$acceptancesArgs<ExtArgs>
    _count?: boolean | ConsentVersionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConsentVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ConsentVersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ConsentVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConsentVersion"
    objects: {
      acceptances: Prisma.$ConsentAcceptancePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      version: string
      content: string
      checksumSha256: string
      createdAt: Date
      isActive: boolean
    }, ExtArgs["result"]["consentVersion"]>
    composites: {}
  }

  type ConsentVersionGetPayload<S extends boolean | null | undefined | ConsentVersionDefaultArgs> = $Result.GetResult<Prisma.$ConsentVersionPayload, S>

  type ConsentVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConsentVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConsentVersionCountAggregateInputType | true
    }

  export interface ConsentVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConsentVersion'], meta: { name: 'ConsentVersion' } }
    /**
     * Find zero or one ConsentVersion that matches the filter.
     * @param {ConsentVersionFindUniqueArgs} args - Arguments to find a ConsentVersion
     * @example
     * // Get one ConsentVersion
     * const consentVersion = await prisma.consentVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConsentVersionFindUniqueArgs>(args: SelectSubset<T, ConsentVersionFindUniqueArgs<ExtArgs>>): Prisma__ConsentVersionClient<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConsentVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConsentVersionFindUniqueOrThrowArgs} args - Arguments to find a ConsentVersion
     * @example
     * // Get one ConsentVersion
     * const consentVersion = await prisma.consentVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConsentVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, ConsentVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConsentVersionClient<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConsentVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentVersionFindFirstArgs} args - Arguments to find a ConsentVersion
     * @example
     * // Get one ConsentVersion
     * const consentVersion = await prisma.consentVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConsentVersionFindFirstArgs>(args?: SelectSubset<T, ConsentVersionFindFirstArgs<ExtArgs>>): Prisma__ConsentVersionClient<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConsentVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentVersionFindFirstOrThrowArgs} args - Arguments to find a ConsentVersion
     * @example
     * // Get one ConsentVersion
     * const consentVersion = await prisma.consentVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConsentVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, ConsentVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConsentVersionClient<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConsentVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConsentVersions
     * const consentVersions = await prisma.consentVersion.findMany()
     * 
     * // Get first 10 ConsentVersions
     * const consentVersions = await prisma.consentVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const consentVersionWithIdOnly = await prisma.consentVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConsentVersionFindManyArgs>(args?: SelectSubset<T, ConsentVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConsentVersion.
     * @param {ConsentVersionCreateArgs} args - Arguments to create a ConsentVersion.
     * @example
     * // Create one ConsentVersion
     * const ConsentVersion = await prisma.consentVersion.create({
     *   data: {
     *     // ... data to create a ConsentVersion
     *   }
     * })
     * 
     */
    create<T extends ConsentVersionCreateArgs>(args: SelectSubset<T, ConsentVersionCreateArgs<ExtArgs>>): Prisma__ConsentVersionClient<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConsentVersions.
     * @param {ConsentVersionCreateManyArgs} args - Arguments to create many ConsentVersions.
     * @example
     * // Create many ConsentVersions
     * const consentVersion = await prisma.consentVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConsentVersionCreateManyArgs>(args?: SelectSubset<T, ConsentVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConsentVersions and returns the data saved in the database.
     * @param {ConsentVersionCreateManyAndReturnArgs} args - Arguments to create many ConsentVersions.
     * @example
     * // Create many ConsentVersions
     * const consentVersion = await prisma.consentVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConsentVersions and only return the `id`
     * const consentVersionWithIdOnly = await prisma.consentVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConsentVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, ConsentVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConsentVersion.
     * @param {ConsentVersionDeleteArgs} args - Arguments to delete one ConsentVersion.
     * @example
     * // Delete one ConsentVersion
     * const ConsentVersion = await prisma.consentVersion.delete({
     *   where: {
     *     // ... filter to delete one ConsentVersion
     *   }
     * })
     * 
     */
    delete<T extends ConsentVersionDeleteArgs>(args: SelectSubset<T, ConsentVersionDeleteArgs<ExtArgs>>): Prisma__ConsentVersionClient<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConsentVersion.
     * @param {ConsentVersionUpdateArgs} args - Arguments to update one ConsentVersion.
     * @example
     * // Update one ConsentVersion
     * const consentVersion = await prisma.consentVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConsentVersionUpdateArgs>(args: SelectSubset<T, ConsentVersionUpdateArgs<ExtArgs>>): Prisma__ConsentVersionClient<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConsentVersions.
     * @param {ConsentVersionDeleteManyArgs} args - Arguments to filter ConsentVersions to delete.
     * @example
     * // Delete a few ConsentVersions
     * const { count } = await prisma.consentVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConsentVersionDeleteManyArgs>(args?: SelectSubset<T, ConsentVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsentVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConsentVersions
     * const consentVersion = await prisma.consentVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConsentVersionUpdateManyArgs>(args: SelectSubset<T, ConsentVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsentVersions and returns the data updated in the database.
     * @param {ConsentVersionUpdateManyAndReturnArgs} args - Arguments to update many ConsentVersions.
     * @example
     * // Update many ConsentVersions
     * const consentVersion = await prisma.consentVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConsentVersions and only return the `id`
     * const consentVersionWithIdOnly = await prisma.consentVersion.updateManyAndReturn({
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
    updateManyAndReturn<T extends ConsentVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, ConsentVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConsentVersion.
     * @param {ConsentVersionUpsertArgs} args - Arguments to update or create a ConsentVersion.
     * @example
     * // Update or create a ConsentVersion
     * const consentVersion = await prisma.consentVersion.upsert({
     *   create: {
     *     // ... data to create a ConsentVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConsentVersion we want to update
     *   }
     * })
     */
    upsert<T extends ConsentVersionUpsertArgs>(args: SelectSubset<T, ConsentVersionUpsertArgs<ExtArgs>>): Prisma__ConsentVersionClient<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConsentVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentVersionCountArgs} args - Arguments to filter ConsentVersions to count.
     * @example
     * // Count the number of ConsentVersions
     * const count = await prisma.consentVersion.count({
     *   where: {
     *     // ... the filter for the ConsentVersions we want to count
     *   }
     * })
    **/
    count<T extends ConsentVersionCountArgs>(
      args?: Subset<T, ConsentVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConsentVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConsentVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ConsentVersionAggregateArgs>(args: Subset<T, ConsentVersionAggregateArgs>): Prisma.PrismaPromise<GetConsentVersionAggregateType<T>>

    /**
     * Group by ConsentVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentVersionGroupByArgs} args - Group by arguments.
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
      T extends ConsentVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConsentVersionGroupByArgs['orderBy'] }
        : { orderBy?: ConsentVersionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ConsentVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConsentVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConsentVersion model
   */
  readonly fields: ConsentVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConsentVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConsentVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    acceptances<T extends ConsentVersion$acceptancesArgs<ExtArgs> = {}>(args?: Subset<T, ConsentVersion$acceptancesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ConsentVersion model
   */
  interface ConsentVersionFieldRefs {
    readonly id: FieldRef<"ConsentVersion", 'String'>
    readonly version: FieldRef<"ConsentVersion", 'String'>
    readonly content: FieldRef<"ConsentVersion", 'String'>
    readonly checksumSha256: FieldRef<"ConsentVersion", 'String'>
    readonly createdAt: FieldRef<"ConsentVersion", 'DateTime'>
    readonly isActive: FieldRef<"ConsentVersion", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * ConsentVersion findUnique
   */
  export type ConsentVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentVersionInclude<ExtArgs> | null
    /**
     * Filter, which ConsentVersion to fetch.
     */
    where: ConsentVersionWhereUniqueInput
  }

  /**
   * ConsentVersion findUniqueOrThrow
   */
  export type ConsentVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentVersionInclude<ExtArgs> | null
    /**
     * Filter, which ConsentVersion to fetch.
     */
    where: ConsentVersionWhereUniqueInput
  }

  /**
   * ConsentVersion findFirst
   */
  export type ConsentVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentVersionInclude<ExtArgs> | null
    /**
     * Filter, which ConsentVersion to fetch.
     */
    where?: ConsentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentVersions to fetch.
     */
    orderBy?: ConsentVersionOrderByWithRelationInput | ConsentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentVersions.
     */
    cursor?: ConsentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentVersions.
     */
    distinct?: ConsentVersionScalarFieldEnum | ConsentVersionScalarFieldEnum[]
  }

  /**
   * ConsentVersion findFirstOrThrow
   */
  export type ConsentVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentVersionInclude<ExtArgs> | null
    /**
     * Filter, which ConsentVersion to fetch.
     */
    where?: ConsentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentVersions to fetch.
     */
    orderBy?: ConsentVersionOrderByWithRelationInput | ConsentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentVersions.
     */
    cursor?: ConsentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentVersions.
     */
    distinct?: ConsentVersionScalarFieldEnum | ConsentVersionScalarFieldEnum[]
  }

  /**
   * ConsentVersion findMany
   */
  export type ConsentVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentVersionInclude<ExtArgs> | null
    /**
     * Filter, which ConsentVersions to fetch.
     */
    where?: ConsentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentVersions to fetch.
     */
    orderBy?: ConsentVersionOrderByWithRelationInput | ConsentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConsentVersions.
     */
    cursor?: ConsentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentVersions.
     */
    skip?: number
    distinct?: ConsentVersionScalarFieldEnum | ConsentVersionScalarFieldEnum[]
  }

  /**
   * ConsentVersion create
   */
  export type ConsentVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a ConsentVersion.
     */
    data: XOR<ConsentVersionCreateInput, ConsentVersionUncheckedCreateInput>
  }

  /**
   * ConsentVersion createMany
   */
  export type ConsentVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConsentVersions.
     */
    data: ConsentVersionCreateManyInput | ConsentVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConsentVersion createManyAndReturn
   */
  export type ConsentVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * The data used to create many ConsentVersions.
     */
    data: ConsentVersionCreateManyInput | ConsentVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConsentVersion update
   */
  export type ConsentVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a ConsentVersion.
     */
    data: XOR<ConsentVersionUpdateInput, ConsentVersionUncheckedUpdateInput>
    /**
     * Choose, which ConsentVersion to update.
     */
    where: ConsentVersionWhereUniqueInput
  }

  /**
   * ConsentVersion updateMany
   */
  export type ConsentVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConsentVersions.
     */
    data: XOR<ConsentVersionUpdateManyMutationInput, ConsentVersionUncheckedUpdateManyInput>
    /**
     * Filter which ConsentVersions to update
     */
    where?: ConsentVersionWhereInput
    /**
     * Limit how many ConsentVersions to update.
     */
    limit?: number
  }

  /**
   * ConsentVersion updateManyAndReturn
   */
  export type ConsentVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * The data used to update ConsentVersions.
     */
    data: XOR<ConsentVersionUpdateManyMutationInput, ConsentVersionUncheckedUpdateManyInput>
    /**
     * Filter which ConsentVersions to update
     */
    where?: ConsentVersionWhereInput
    /**
     * Limit how many ConsentVersions to update.
     */
    limit?: number
  }

  /**
   * ConsentVersion upsert
   */
  export type ConsentVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the ConsentVersion to update in case it exists.
     */
    where: ConsentVersionWhereUniqueInput
    /**
     * In case the ConsentVersion found by the `where` argument doesn't exist, create a new ConsentVersion with this data.
     */
    create: XOR<ConsentVersionCreateInput, ConsentVersionUncheckedCreateInput>
    /**
     * In case the ConsentVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConsentVersionUpdateInput, ConsentVersionUncheckedUpdateInput>
  }

  /**
   * ConsentVersion delete
   */
  export type ConsentVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentVersionInclude<ExtArgs> | null
    /**
     * Filter which ConsentVersion to delete.
     */
    where: ConsentVersionWhereUniqueInput
  }

  /**
   * ConsentVersion deleteMany
   */
  export type ConsentVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentVersions to delete
     */
    where?: ConsentVersionWhereInput
    /**
     * Limit how many ConsentVersions to delete.
     */
    limit?: number
  }

  /**
   * ConsentVersion.acceptances
   */
  export type ConsentVersion$acceptancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    where?: ConsentAcceptanceWhereInput
    orderBy?: ConsentAcceptanceOrderByWithRelationInput | ConsentAcceptanceOrderByWithRelationInput[]
    cursor?: ConsentAcceptanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConsentAcceptanceScalarFieldEnum | ConsentAcceptanceScalarFieldEnum[]
  }

  /**
   * ConsentVersion without action
   */
  export type ConsentVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentVersion
     */
    select?: ConsentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentVersion
     */
    omit?: ConsentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentVersionInclude<ExtArgs> | null
  }


  /**
   * Model ConsentAcceptance
   */

  export type AggregateConsentAcceptance = {
    _count: ConsentAcceptanceCountAggregateOutputType | null
    _min: ConsentAcceptanceMinAggregateOutputType | null
    _max: ConsentAcceptanceMaxAggregateOutputType | null
  }

  export type ConsentAcceptanceMinAggregateOutputType = {
    id: string | null
    consentVersionId: string | null
    intakeId: string | null
    acceptedAt: Date | null
    ipHash: string | null
    userAgent: string | null
    locale: string | null
  }

  export type ConsentAcceptanceMaxAggregateOutputType = {
    id: string | null
    consentVersionId: string | null
    intakeId: string | null
    acceptedAt: Date | null
    ipHash: string | null
    userAgent: string | null
    locale: string | null
  }

  export type ConsentAcceptanceCountAggregateOutputType = {
    id: number
    consentVersionId: number
    intakeId: number
    acceptedAt: number
    ipHash: number
    userAgent: number
    locale: number
    _all: number
  }


  export type ConsentAcceptanceMinAggregateInputType = {
    id?: true
    consentVersionId?: true
    intakeId?: true
    acceptedAt?: true
    ipHash?: true
    userAgent?: true
    locale?: true
  }

  export type ConsentAcceptanceMaxAggregateInputType = {
    id?: true
    consentVersionId?: true
    intakeId?: true
    acceptedAt?: true
    ipHash?: true
    userAgent?: true
    locale?: true
  }

  export type ConsentAcceptanceCountAggregateInputType = {
    id?: true
    consentVersionId?: true
    intakeId?: true
    acceptedAt?: true
    ipHash?: true
    userAgent?: true
    locale?: true
    _all?: true
  }

  export type ConsentAcceptanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentAcceptance to aggregate.
     */
    where?: ConsentAcceptanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentAcceptances to fetch.
     */
    orderBy?: ConsentAcceptanceOrderByWithRelationInput | ConsentAcceptanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConsentAcceptanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentAcceptances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentAcceptances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConsentAcceptances
    **/
    _count?: true | ConsentAcceptanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConsentAcceptanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConsentAcceptanceMaxAggregateInputType
  }

  export type GetConsentAcceptanceAggregateType<T extends ConsentAcceptanceAggregateArgs> = {
        [P in keyof T & keyof AggregateConsentAcceptance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConsentAcceptance[P]>
      : GetScalarType<T[P], AggregateConsentAcceptance[P]>
  }




  export type ConsentAcceptanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentAcceptanceWhereInput
    orderBy?: ConsentAcceptanceOrderByWithAggregationInput | ConsentAcceptanceOrderByWithAggregationInput[]
    by: ConsentAcceptanceScalarFieldEnum[] | ConsentAcceptanceScalarFieldEnum
    having?: ConsentAcceptanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConsentAcceptanceCountAggregateInputType | true
    _min?: ConsentAcceptanceMinAggregateInputType
    _max?: ConsentAcceptanceMaxAggregateInputType
  }

  export type ConsentAcceptanceGroupByOutputType = {
    id: string
    consentVersionId: string
    intakeId: string
    acceptedAt: Date
    ipHash: string | null
    userAgent: string | null
    locale: string | null
    _count: ConsentAcceptanceCountAggregateOutputType | null
    _min: ConsentAcceptanceMinAggregateOutputType | null
    _max: ConsentAcceptanceMaxAggregateOutputType | null
  }

  type GetConsentAcceptanceGroupByPayload<T extends ConsentAcceptanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConsentAcceptanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConsentAcceptanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConsentAcceptanceGroupByOutputType[P]>
            : GetScalarType<T[P], ConsentAcceptanceGroupByOutputType[P]>
        }
      >
    >


  export type ConsentAcceptanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    consentVersionId?: boolean
    intakeId?: boolean
    acceptedAt?: boolean
    ipHash?: boolean
    userAgent?: boolean
    locale?: boolean
    consentVersion?: boolean | ConsentVersionDefaultArgs<ExtArgs>
    intake?: boolean | ContactIntakeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentAcceptance"]>

  export type ConsentAcceptanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    consentVersionId?: boolean
    intakeId?: boolean
    acceptedAt?: boolean
    ipHash?: boolean
    userAgent?: boolean
    locale?: boolean
    consentVersion?: boolean | ConsentVersionDefaultArgs<ExtArgs>
    intake?: boolean | ContactIntakeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentAcceptance"]>

  export type ConsentAcceptanceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    consentVersionId?: boolean
    intakeId?: boolean
    acceptedAt?: boolean
    ipHash?: boolean
    userAgent?: boolean
    locale?: boolean
    consentVersion?: boolean | ConsentVersionDefaultArgs<ExtArgs>
    intake?: boolean | ContactIntakeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentAcceptance"]>

  export type ConsentAcceptanceSelectScalar = {
    id?: boolean
    consentVersionId?: boolean
    intakeId?: boolean
    acceptedAt?: boolean
    ipHash?: boolean
    userAgent?: boolean
    locale?: boolean
  }

  export type ConsentAcceptanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "consentVersionId" | "intakeId" | "acceptedAt" | "ipHash" | "userAgent" | "locale", ExtArgs["result"]["consentAcceptance"]>
  export type ConsentAcceptanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    consentVersion?: boolean | ConsentVersionDefaultArgs<ExtArgs>
    intake?: boolean | ContactIntakeDefaultArgs<ExtArgs>
  }
  export type ConsentAcceptanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    consentVersion?: boolean | ConsentVersionDefaultArgs<ExtArgs>
    intake?: boolean | ContactIntakeDefaultArgs<ExtArgs>
  }
  export type ConsentAcceptanceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    consentVersion?: boolean | ConsentVersionDefaultArgs<ExtArgs>
    intake?: boolean | ContactIntakeDefaultArgs<ExtArgs>
  }

  export type $ConsentAcceptancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConsentAcceptance"
    objects: {
      consentVersion: Prisma.$ConsentVersionPayload<ExtArgs>
      intake: Prisma.$ContactIntakePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      consentVersionId: string
      intakeId: string
      acceptedAt: Date
      ipHash: string | null
      userAgent: string | null
      locale: string | null
    }, ExtArgs["result"]["consentAcceptance"]>
    composites: {}
  }

  type ConsentAcceptanceGetPayload<S extends boolean | null | undefined | ConsentAcceptanceDefaultArgs> = $Result.GetResult<Prisma.$ConsentAcceptancePayload, S>

  type ConsentAcceptanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConsentAcceptanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConsentAcceptanceCountAggregateInputType | true
    }

  export interface ConsentAcceptanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConsentAcceptance'], meta: { name: 'ConsentAcceptance' } }
    /**
     * Find zero or one ConsentAcceptance that matches the filter.
     * @param {ConsentAcceptanceFindUniqueArgs} args - Arguments to find a ConsentAcceptance
     * @example
     * // Get one ConsentAcceptance
     * const consentAcceptance = await prisma.consentAcceptance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConsentAcceptanceFindUniqueArgs>(args: SelectSubset<T, ConsentAcceptanceFindUniqueArgs<ExtArgs>>): Prisma__ConsentAcceptanceClient<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConsentAcceptance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConsentAcceptanceFindUniqueOrThrowArgs} args - Arguments to find a ConsentAcceptance
     * @example
     * // Get one ConsentAcceptance
     * const consentAcceptance = await prisma.consentAcceptance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConsentAcceptanceFindUniqueOrThrowArgs>(args: SelectSubset<T, ConsentAcceptanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConsentAcceptanceClient<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConsentAcceptance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentAcceptanceFindFirstArgs} args - Arguments to find a ConsentAcceptance
     * @example
     * // Get one ConsentAcceptance
     * const consentAcceptance = await prisma.consentAcceptance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConsentAcceptanceFindFirstArgs>(args?: SelectSubset<T, ConsentAcceptanceFindFirstArgs<ExtArgs>>): Prisma__ConsentAcceptanceClient<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConsentAcceptance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentAcceptanceFindFirstOrThrowArgs} args - Arguments to find a ConsentAcceptance
     * @example
     * // Get one ConsentAcceptance
     * const consentAcceptance = await prisma.consentAcceptance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConsentAcceptanceFindFirstOrThrowArgs>(args?: SelectSubset<T, ConsentAcceptanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConsentAcceptanceClient<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConsentAcceptances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentAcceptanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConsentAcceptances
     * const consentAcceptances = await prisma.consentAcceptance.findMany()
     * 
     * // Get first 10 ConsentAcceptances
     * const consentAcceptances = await prisma.consentAcceptance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const consentAcceptanceWithIdOnly = await prisma.consentAcceptance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConsentAcceptanceFindManyArgs>(args?: SelectSubset<T, ConsentAcceptanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConsentAcceptance.
     * @param {ConsentAcceptanceCreateArgs} args - Arguments to create a ConsentAcceptance.
     * @example
     * // Create one ConsentAcceptance
     * const ConsentAcceptance = await prisma.consentAcceptance.create({
     *   data: {
     *     // ... data to create a ConsentAcceptance
     *   }
     * })
     * 
     */
    create<T extends ConsentAcceptanceCreateArgs>(args: SelectSubset<T, ConsentAcceptanceCreateArgs<ExtArgs>>): Prisma__ConsentAcceptanceClient<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConsentAcceptances.
     * @param {ConsentAcceptanceCreateManyArgs} args - Arguments to create many ConsentAcceptances.
     * @example
     * // Create many ConsentAcceptances
     * const consentAcceptance = await prisma.consentAcceptance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConsentAcceptanceCreateManyArgs>(args?: SelectSubset<T, ConsentAcceptanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConsentAcceptances and returns the data saved in the database.
     * @param {ConsentAcceptanceCreateManyAndReturnArgs} args - Arguments to create many ConsentAcceptances.
     * @example
     * // Create many ConsentAcceptances
     * const consentAcceptance = await prisma.consentAcceptance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConsentAcceptances and only return the `id`
     * const consentAcceptanceWithIdOnly = await prisma.consentAcceptance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConsentAcceptanceCreateManyAndReturnArgs>(args?: SelectSubset<T, ConsentAcceptanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConsentAcceptance.
     * @param {ConsentAcceptanceDeleteArgs} args - Arguments to delete one ConsentAcceptance.
     * @example
     * // Delete one ConsentAcceptance
     * const ConsentAcceptance = await prisma.consentAcceptance.delete({
     *   where: {
     *     // ... filter to delete one ConsentAcceptance
     *   }
     * })
     * 
     */
    delete<T extends ConsentAcceptanceDeleteArgs>(args: SelectSubset<T, ConsentAcceptanceDeleteArgs<ExtArgs>>): Prisma__ConsentAcceptanceClient<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConsentAcceptance.
     * @param {ConsentAcceptanceUpdateArgs} args - Arguments to update one ConsentAcceptance.
     * @example
     * // Update one ConsentAcceptance
     * const consentAcceptance = await prisma.consentAcceptance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConsentAcceptanceUpdateArgs>(args: SelectSubset<T, ConsentAcceptanceUpdateArgs<ExtArgs>>): Prisma__ConsentAcceptanceClient<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConsentAcceptances.
     * @param {ConsentAcceptanceDeleteManyArgs} args - Arguments to filter ConsentAcceptances to delete.
     * @example
     * // Delete a few ConsentAcceptances
     * const { count } = await prisma.consentAcceptance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConsentAcceptanceDeleteManyArgs>(args?: SelectSubset<T, ConsentAcceptanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsentAcceptances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentAcceptanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConsentAcceptances
     * const consentAcceptance = await prisma.consentAcceptance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConsentAcceptanceUpdateManyArgs>(args: SelectSubset<T, ConsentAcceptanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsentAcceptances and returns the data updated in the database.
     * @param {ConsentAcceptanceUpdateManyAndReturnArgs} args - Arguments to update many ConsentAcceptances.
     * @example
     * // Update many ConsentAcceptances
     * const consentAcceptance = await prisma.consentAcceptance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConsentAcceptances and only return the `id`
     * const consentAcceptanceWithIdOnly = await prisma.consentAcceptance.updateManyAndReturn({
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
    updateManyAndReturn<T extends ConsentAcceptanceUpdateManyAndReturnArgs>(args: SelectSubset<T, ConsentAcceptanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConsentAcceptance.
     * @param {ConsentAcceptanceUpsertArgs} args - Arguments to update or create a ConsentAcceptance.
     * @example
     * // Update or create a ConsentAcceptance
     * const consentAcceptance = await prisma.consentAcceptance.upsert({
     *   create: {
     *     // ... data to create a ConsentAcceptance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConsentAcceptance we want to update
     *   }
     * })
     */
    upsert<T extends ConsentAcceptanceUpsertArgs>(args: SelectSubset<T, ConsentAcceptanceUpsertArgs<ExtArgs>>): Prisma__ConsentAcceptanceClient<$Result.GetResult<Prisma.$ConsentAcceptancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConsentAcceptances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentAcceptanceCountArgs} args - Arguments to filter ConsentAcceptances to count.
     * @example
     * // Count the number of ConsentAcceptances
     * const count = await prisma.consentAcceptance.count({
     *   where: {
     *     // ... the filter for the ConsentAcceptances we want to count
     *   }
     * })
    **/
    count<T extends ConsentAcceptanceCountArgs>(
      args?: Subset<T, ConsentAcceptanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConsentAcceptanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConsentAcceptance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentAcceptanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ConsentAcceptanceAggregateArgs>(args: Subset<T, ConsentAcceptanceAggregateArgs>): Prisma.PrismaPromise<GetConsentAcceptanceAggregateType<T>>

    /**
     * Group by ConsentAcceptance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentAcceptanceGroupByArgs} args - Group by arguments.
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
      T extends ConsentAcceptanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConsentAcceptanceGroupByArgs['orderBy'] }
        : { orderBy?: ConsentAcceptanceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ConsentAcceptanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConsentAcceptanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConsentAcceptance model
   */
  readonly fields: ConsentAcceptanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConsentAcceptance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConsentAcceptanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    consentVersion<T extends ConsentVersionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConsentVersionDefaultArgs<ExtArgs>>): Prisma__ConsentVersionClient<$Result.GetResult<Prisma.$ConsentVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    intake<T extends ContactIntakeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContactIntakeDefaultArgs<ExtArgs>>): Prisma__ContactIntakeClient<$Result.GetResult<Prisma.$ContactIntakePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ConsentAcceptance model
   */
  interface ConsentAcceptanceFieldRefs {
    readonly id: FieldRef<"ConsentAcceptance", 'String'>
    readonly consentVersionId: FieldRef<"ConsentAcceptance", 'String'>
    readonly intakeId: FieldRef<"ConsentAcceptance", 'String'>
    readonly acceptedAt: FieldRef<"ConsentAcceptance", 'DateTime'>
    readonly ipHash: FieldRef<"ConsentAcceptance", 'String'>
    readonly userAgent: FieldRef<"ConsentAcceptance", 'String'>
    readonly locale: FieldRef<"ConsentAcceptance", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ConsentAcceptance findUnique
   */
  export type ConsentAcceptanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    /**
     * Filter, which ConsentAcceptance to fetch.
     */
    where: ConsentAcceptanceWhereUniqueInput
  }

  /**
   * ConsentAcceptance findUniqueOrThrow
   */
  export type ConsentAcceptanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    /**
     * Filter, which ConsentAcceptance to fetch.
     */
    where: ConsentAcceptanceWhereUniqueInput
  }

  /**
   * ConsentAcceptance findFirst
   */
  export type ConsentAcceptanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    /**
     * Filter, which ConsentAcceptance to fetch.
     */
    where?: ConsentAcceptanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentAcceptances to fetch.
     */
    orderBy?: ConsentAcceptanceOrderByWithRelationInput | ConsentAcceptanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentAcceptances.
     */
    cursor?: ConsentAcceptanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentAcceptances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentAcceptances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentAcceptances.
     */
    distinct?: ConsentAcceptanceScalarFieldEnum | ConsentAcceptanceScalarFieldEnum[]
  }

  /**
   * ConsentAcceptance findFirstOrThrow
   */
  export type ConsentAcceptanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    /**
     * Filter, which ConsentAcceptance to fetch.
     */
    where?: ConsentAcceptanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentAcceptances to fetch.
     */
    orderBy?: ConsentAcceptanceOrderByWithRelationInput | ConsentAcceptanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentAcceptances.
     */
    cursor?: ConsentAcceptanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentAcceptances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentAcceptances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentAcceptances.
     */
    distinct?: ConsentAcceptanceScalarFieldEnum | ConsentAcceptanceScalarFieldEnum[]
  }

  /**
   * ConsentAcceptance findMany
   */
  export type ConsentAcceptanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    /**
     * Filter, which ConsentAcceptances to fetch.
     */
    where?: ConsentAcceptanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentAcceptances to fetch.
     */
    orderBy?: ConsentAcceptanceOrderByWithRelationInput | ConsentAcceptanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConsentAcceptances.
     */
    cursor?: ConsentAcceptanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentAcceptances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentAcceptances.
     */
    skip?: number
    distinct?: ConsentAcceptanceScalarFieldEnum | ConsentAcceptanceScalarFieldEnum[]
  }

  /**
   * ConsentAcceptance create
   */
  export type ConsentAcceptanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    /**
     * The data needed to create a ConsentAcceptance.
     */
    data: XOR<ConsentAcceptanceCreateInput, ConsentAcceptanceUncheckedCreateInput>
  }

  /**
   * ConsentAcceptance createMany
   */
  export type ConsentAcceptanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConsentAcceptances.
     */
    data: ConsentAcceptanceCreateManyInput | ConsentAcceptanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConsentAcceptance createManyAndReturn
   */
  export type ConsentAcceptanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * The data used to create many ConsentAcceptances.
     */
    data: ConsentAcceptanceCreateManyInput | ConsentAcceptanceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConsentAcceptance update
   */
  export type ConsentAcceptanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    /**
     * The data needed to update a ConsentAcceptance.
     */
    data: XOR<ConsentAcceptanceUpdateInput, ConsentAcceptanceUncheckedUpdateInput>
    /**
     * Choose, which ConsentAcceptance to update.
     */
    where: ConsentAcceptanceWhereUniqueInput
  }

  /**
   * ConsentAcceptance updateMany
   */
  export type ConsentAcceptanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConsentAcceptances.
     */
    data: XOR<ConsentAcceptanceUpdateManyMutationInput, ConsentAcceptanceUncheckedUpdateManyInput>
    /**
     * Filter which ConsentAcceptances to update
     */
    where?: ConsentAcceptanceWhereInput
    /**
     * Limit how many ConsentAcceptances to update.
     */
    limit?: number
  }

  /**
   * ConsentAcceptance updateManyAndReturn
   */
  export type ConsentAcceptanceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * The data used to update ConsentAcceptances.
     */
    data: XOR<ConsentAcceptanceUpdateManyMutationInput, ConsentAcceptanceUncheckedUpdateManyInput>
    /**
     * Filter which ConsentAcceptances to update
     */
    where?: ConsentAcceptanceWhereInput
    /**
     * Limit how many ConsentAcceptances to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConsentAcceptance upsert
   */
  export type ConsentAcceptanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    /**
     * The filter to search for the ConsentAcceptance to update in case it exists.
     */
    where: ConsentAcceptanceWhereUniqueInput
    /**
     * In case the ConsentAcceptance found by the `where` argument doesn't exist, create a new ConsentAcceptance with this data.
     */
    create: XOR<ConsentAcceptanceCreateInput, ConsentAcceptanceUncheckedCreateInput>
    /**
     * In case the ConsentAcceptance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConsentAcceptanceUpdateInput, ConsentAcceptanceUncheckedUpdateInput>
  }

  /**
   * ConsentAcceptance delete
   */
  export type ConsentAcceptanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
    /**
     * Filter which ConsentAcceptance to delete.
     */
    where: ConsentAcceptanceWhereUniqueInput
  }

  /**
   * ConsentAcceptance deleteMany
   */
  export type ConsentAcceptanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentAcceptances to delete
     */
    where?: ConsentAcceptanceWhereInput
    /**
     * Limit how many ConsentAcceptances to delete.
     */
    limit?: number
  }

  /**
   * ConsentAcceptance without action
   */
  export type ConsentAcceptanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentAcceptance
     */
    select?: ConsentAcceptanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentAcceptance
     */
    omit?: ConsentAcceptanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentAcceptanceInclude<ExtArgs> | null
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


  export const ContactIntakeScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    tone: 'tone',
    route: 'route',
    priority: 'priority',
    name: 'name',
    email: 'email',
    message: 'message',
    phone: 'phone',
    status: 'status',
    spamScore: 'spamScore',
    meta: 'meta'
  };

  export type ContactIntakeScalarFieldEnum = (typeof ContactIntakeScalarFieldEnum)[keyof typeof ContactIntakeScalarFieldEnum]


  export const ConsentVersionScalarFieldEnum: {
    id: 'id',
    version: 'version',
    content: 'content',
    checksumSha256: 'checksumSha256',
    createdAt: 'createdAt',
    isActive: 'isActive'
  };

  export type ConsentVersionScalarFieldEnum = (typeof ConsentVersionScalarFieldEnum)[keyof typeof ConsentVersionScalarFieldEnum]


  export const ConsentAcceptanceScalarFieldEnum: {
    id: 'id',
    consentVersionId: 'consentVersionId',
    intakeId: 'intakeId',
    acceptedAt: 'acceptedAt',
    ipHash: 'ipHash',
    userAgent: 'userAgent',
    locale: 'locale'
  };

  export type ConsentAcceptanceScalarFieldEnum = (typeof ConsentAcceptanceScalarFieldEnum)[keyof typeof ConsentAcceptanceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'IntakeTone'
   */
  export type EnumIntakeToneFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntakeTone'>
    


  /**
   * Reference to a field of type 'IntakeTone[]'
   */
  export type ListEnumIntakeToneFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntakeTone[]'>
    


  /**
   * Reference to a field of type 'IntakePriority'
   */
  export type EnumIntakePriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntakePriority'>
    


  /**
   * Reference to a field of type 'IntakePriority[]'
   */
  export type ListEnumIntakePriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntakePriority[]'>
    


  /**
   * Reference to a field of type 'IntakeStatus'
   */
  export type EnumIntakeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntakeStatus'>
    


  /**
   * Reference to a field of type 'IntakeStatus[]'
   */
  export type ListEnumIntakeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntakeStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type ContactIntakeWhereInput = {
    AND?: ContactIntakeWhereInput | ContactIntakeWhereInput[]
    OR?: ContactIntakeWhereInput[]
    NOT?: ContactIntakeWhereInput | ContactIntakeWhereInput[]
    id?: StringFilter<"ContactIntake"> | string
    createdAt?: DateTimeFilter<"ContactIntake"> | Date | string
    tone?: EnumIntakeToneFilter<"ContactIntake"> | $Enums.IntakeTone
    route?: StringFilter<"ContactIntake"> | string
    priority?: EnumIntakePriorityFilter<"ContactIntake"> | $Enums.IntakePriority
    name?: StringNullableFilter<"ContactIntake"> | string | null
    email?: StringFilter<"ContactIntake"> | string
    message?: StringFilter<"ContactIntake"> | string
    phone?: StringNullableFilter<"ContactIntake"> | string | null
    status?: EnumIntakeStatusFilter<"ContactIntake"> | $Enums.IntakeStatus
    spamScore?: FloatNullableFilter<"ContactIntake"> | number | null
    meta?: JsonNullableFilter<"ContactIntake">
    consentAcceptances?: ConsentAcceptanceListRelationFilter
  }

  export type ContactIntakeOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    tone?: SortOrder
    route?: SortOrder
    priority?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    message?: SortOrder
    phone?: SortOrderInput | SortOrder
    status?: SortOrder
    spamScore?: SortOrderInput | SortOrder
    meta?: SortOrderInput | SortOrder
    consentAcceptances?: ConsentAcceptanceOrderByRelationAggregateInput
  }

  export type ContactIntakeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ContactIntakeWhereInput | ContactIntakeWhereInput[]
    OR?: ContactIntakeWhereInput[]
    NOT?: ContactIntakeWhereInput | ContactIntakeWhereInput[]
    createdAt?: DateTimeFilter<"ContactIntake"> | Date | string
    tone?: EnumIntakeToneFilter<"ContactIntake"> | $Enums.IntakeTone
    route?: StringFilter<"ContactIntake"> | string
    priority?: EnumIntakePriorityFilter<"ContactIntake"> | $Enums.IntakePriority
    name?: StringNullableFilter<"ContactIntake"> | string | null
    email?: StringFilter<"ContactIntake"> | string
    message?: StringFilter<"ContactIntake"> | string
    phone?: StringNullableFilter<"ContactIntake"> | string | null
    status?: EnumIntakeStatusFilter<"ContactIntake"> | $Enums.IntakeStatus
    spamScore?: FloatNullableFilter<"ContactIntake"> | number | null
    meta?: JsonNullableFilter<"ContactIntake">
    consentAcceptances?: ConsentAcceptanceListRelationFilter
  }, "id">

  export type ContactIntakeOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    tone?: SortOrder
    route?: SortOrder
    priority?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    message?: SortOrder
    phone?: SortOrderInput | SortOrder
    status?: SortOrder
    spamScore?: SortOrderInput | SortOrder
    meta?: SortOrderInput | SortOrder
    _count?: ContactIntakeCountOrderByAggregateInput
    _avg?: ContactIntakeAvgOrderByAggregateInput
    _max?: ContactIntakeMaxOrderByAggregateInput
    _min?: ContactIntakeMinOrderByAggregateInput
    _sum?: ContactIntakeSumOrderByAggregateInput
  }

  export type ContactIntakeScalarWhereWithAggregatesInput = {
    AND?: ContactIntakeScalarWhereWithAggregatesInput | ContactIntakeScalarWhereWithAggregatesInput[]
    OR?: ContactIntakeScalarWhereWithAggregatesInput[]
    NOT?: ContactIntakeScalarWhereWithAggregatesInput | ContactIntakeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContactIntake"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ContactIntake"> | Date | string
    tone?: EnumIntakeToneWithAggregatesFilter<"ContactIntake"> | $Enums.IntakeTone
    route?: StringWithAggregatesFilter<"ContactIntake"> | string
    priority?: EnumIntakePriorityWithAggregatesFilter<"ContactIntake"> | $Enums.IntakePriority
    name?: StringNullableWithAggregatesFilter<"ContactIntake"> | string | null
    email?: StringWithAggregatesFilter<"ContactIntake"> | string
    message?: StringWithAggregatesFilter<"ContactIntake"> | string
    phone?: StringNullableWithAggregatesFilter<"ContactIntake"> | string | null
    status?: EnumIntakeStatusWithAggregatesFilter<"ContactIntake"> | $Enums.IntakeStatus
    spamScore?: FloatNullableWithAggregatesFilter<"ContactIntake"> | number | null
    meta?: JsonNullableWithAggregatesFilter<"ContactIntake">
  }

  export type ConsentVersionWhereInput = {
    AND?: ConsentVersionWhereInput | ConsentVersionWhereInput[]
    OR?: ConsentVersionWhereInput[]
    NOT?: ConsentVersionWhereInput | ConsentVersionWhereInput[]
    id?: StringFilter<"ConsentVersion"> | string
    version?: StringFilter<"ConsentVersion"> | string
    content?: StringFilter<"ConsentVersion"> | string
    checksumSha256?: StringFilter<"ConsentVersion"> | string
    createdAt?: DateTimeFilter<"ConsentVersion"> | Date | string
    isActive?: BoolFilter<"ConsentVersion"> | boolean
    acceptances?: ConsentAcceptanceListRelationFilter
  }

  export type ConsentVersionOrderByWithRelationInput = {
    id?: SortOrder
    version?: SortOrder
    content?: SortOrder
    checksumSha256?: SortOrder
    createdAt?: SortOrder
    isActive?: SortOrder
    acceptances?: ConsentAcceptanceOrderByRelationAggregateInput
  }

  export type ConsentVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    version?: string
    AND?: ConsentVersionWhereInput | ConsentVersionWhereInput[]
    OR?: ConsentVersionWhereInput[]
    NOT?: ConsentVersionWhereInput | ConsentVersionWhereInput[]
    content?: StringFilter<"ConsentVersion"> | string
    checksumSha256?: StringFilter<"ConsentVersion"> | string
    createdAt?: DateTimeFilter<"ConsentVersion"> | Date | string
    isActive?: BoolFilter<"ConsentVersion"> | boolean
    acceptances?: ConsentAcceptanceListRelationFilter
  }, "id" | "version">

  export type ConsentVersionOrderByWithAggregationInput = {
    id?: SortOrder
    version?: SortOrder
    content?: SortOrder
    checksumSha256?: SortOrder
    createdAt?: SortOrder
    isActive?: SortOrder
    _count?: ConsentVersionCountOrderByAggregateInput
    _max?: ConsentVersionMaxOrderByAggregateInput
    _min?: ConsentVersionMinOrderByAggregateInput
  }

  export type ConsentVersionScalarWhereWithAggregatesInput = {
    AND?: ConsentVersionScalarWhereWithAggregatesInput | ConsentVersionScalarWhereWithAggregatesInput[]
    OR?: ConsentVersionScalarWhereWithAggregatesInput[]
    NOT?: ConsentVersionScalarWhereWithAggregatesInput | ConsentVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConsentVersion"> | string
    version?: StringWithAggregatesFilter<"ConsentVersion"> | string
    content?: StringWithAggregatesFilter<"ConsentVersion"> | string
    checksumSha256?: StringWithAggregatesFilter<"ConsentVersion"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ConsentVersion"> | Date | string
    isActive?: BoolWithAggregatesFilter<"ConsentVersion"> | boolean
  }

  export type ConsentAcceptanceWhereInput = {
    AND?: ConsentAcceptanceWhereInput | ConsentAcceptanceWhereInput[]
    OR?: ConsentAcceptanceWhereInput[]
    NOT?: ConsentAcceptanceWhereInput | ConsentAcceptanceWhereInput[]
    id?: StringFilter<"ConsentAcceptance"> | string
    consentVersionId?: StringFilter<"ConsentAcceptance"> | string
    intakeId?: StringFilter<"ConsentAcceptance"> | string
    acceptedAt?: DateTimeFilter<"ConsentAcceptance"> | Date | string
    ipHash?: StringNullableFilter<"ConsentAcceptance"> | string | null
    userAgent?: StringNullableFilter<"ConsentAcceptance"> | string | null
    locale?: StringNullableFilter<"ConsentAcceptance"> | string | null
    consentVersion?: XOR<ConsentVersionScalarRelationFilter, ConsentVersionWhereInput>
    intake?: XOR<ContactIntakeScalarRelationFilter, ContactIntakeWhereInput>
  }

  export type ConsentAcceptanceOrderByWithRelationInput = {
    id?: SortOrder
    consentVersionId?: SortOrder
    intakeId?: SortOrder
    acceptedAt?: SortOrder
    ipHash?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    locale?: SortOrderInput | SortOrder
    consentVersion?: ConsentVersionOrderByWithRelationInput
    intake?: ContactIntakeOrderByWithRelationInput
  }

  export type ConsentAcceptanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConsentAcceptanceWhereInput | ConsentAcceptanceWhereInput[]
    OR?: ConsentAcceptanceWhereInput[]
    NOT?: ConsentAcceptanceWhereInput | ConsentAcceptanceWhereInput[]
    consentVersionId?: StringFilter<"ConsentAcceptance"> | string
    intakeId?: StringFilter<"ConsentAcceptance"> | string
    acceptedAt?: DateTimeFilter<"ConsentAcceptance"> | Date | string
    ipHash?: StringNullableFilter<"ConsentAcceptance"> | string | null
    userAgent?: StringNullableFilter<"ConsentAcceptance"> | string | null
    locale?: StringNullableFilter<"ConsentAcceptance"> | string | null
    consentVersion?: XOR<ConsentVersionScalarRelationFilter, ConsentVersionWhereInput>
    intake?: XOR<ContactIntakeScalarRelationFilter, ContactIntakeWhereInput>
  }, "id">

  export type ConsentAcceptanceOrderByWithAggregationInput = {
    id?: SortOrder
    consentVersionId?: SortOrder
    intakeId?: SortOrder
    acceptedAt?: SortOrder
    ipHash?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    locale?: SortOrderInput | SortOrder
    _count?: ConsentAcceptanceCountOrderByAggregateInput
    _max?: ConsentAcceptanceMaxOrderByAggregateInput
    _min?: ConsentAcceptanceMinOrderByAggregateInput
  }

  export type ConsentAcceptanceScalarWhereWithAggregatesInput = {
    AND?: ConsentAcceptanceScalarWhereWithAggregatesInput | ConsentAcceptanceScalarWhereWithAggregatesInput[]
    OR?: ConsentAcceptanceScalarWhereWithAggregatesInput[]
    NOT?: ConsentAcceptanceScalarWhereWithAggregatesInput | ConsentAcceptanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConsentAcceptance"> | string
    consentVersionId?: StringWithAggregatesFilter<"ConsentAcceptance"> | string
    intakeId?: StringWithAggregatesFilter<"ConsentAcceptance"> | string
    acceptedAt?: DateTimeWithAggregatesFilter<"ConsentAcceptance"> | Date | string
    ipHash?: StringNullableWithAggregatesFilter<"ConsentAcceptance"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"ConsentAcceptance"> | string | null
    locale?: StringNullableWithAggregatesFilter<"ConsentAcceptance"> | string | null
  }

  export type ContactIntakeCreateInput = {
    id?: string
    createdAt?: Date | string
    tone: $Enums.IntakeTone
    route: string
    priority: $Enums.IntakePriority
    name?: string | null
    email: string
    message: string
    phone?: string | null
    status?: $Enums.IntakeStatus
    spamScore?: number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    consentAcceptances?: ConsentAcceptanceCreateNestedManyWithoutIntakeInput
  }

  export type ContactIntakeUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    tone: $Enums.IntakeTone
    route: string
    priority: $Enums.IntakePriority
    name?: string | null
    email: string
    message: string
    phone?: string | null
    status?: $Enums.IntakeStatus
    spamScore?: number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    consentAcceptances?: ConsentAcceptanceUncheckedCreateNestedManyWithoutIntakeInput
  }

  export type ContactIntakeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumIntakeToneFieldUpdateOperationsInput | $Enums.IntakeTone
    route?: StringFieldUpdateOperationsInput | string
    priority?: EnumIntakePriorityFieldUpdateOperationsInput | $Enums.IntakePriority
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIntakeStatusFieldUpdateOperationsInput | $Enums.IntakeStatus
    spamScore?: NullableFloatFieldUpdateOperationsInput | number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    consentAcceptances?: ConsentAcceptanceUpdateManyWithoutIntakeNestedInput
  }

  export type ContactIntakeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumIntakeToneFieldUpdateOperationsInput | $Enums.IntakeTone
    route?: StringFieldUpdateOperationsInput | string
    priority?: EnumIntakePriorityFieldUpdateOperationsInput | $Enums.IntakePriority
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIntakeStatusFieldUpdateOperationsInput | $Enums.IntakeStatus
    spamScore?: NullableFloatFieldUpdateOperationsInput | number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    consentAcceptances?: ConsentAcceptanceUncheckedUpdateManyWithoutIntakeNestedInput
  }

  export type ContactIntakeCreateManyInput = {
    id?: string
    createdAt?: Date | string
    tone: $Enums.IntakeTone
    route: string
    priority: $Enums.IntakePriority
    name?: string | null
    email: string
    message: string
    phone?: string | null
    status?: $Enums.IntakeStatus
    spamScore?: number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ContactIntakeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumIntakeToneFieldUpdateOperationsInput | $Enums.IntakeTone
    route?: StringFieldUpdateOperationsInput | string
    priority?: EnumIntakePriorityFieldUpdateOperationsInput | $Enums.IntakePriority
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIntakeStatusFieldUpdateOperationsInput | $Enums.IntakeStatus
    spamScore?: NullableFloatFieldUpdateOperationsInput | number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ContactIntakeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumIntakeToneFieldUpdateOperationsInput | $Enums.IntakeTone
    route?: StringFieldUpdateOperationsInput | string
    priority?: EnumIntakePriorityFieldUpdateOperationsInput | $Enums.IntakePriority
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIntakeStatusFieldUpdateOperationsInput | $Enums.IntakeStatus
    spamScore?: NullableFloatFieldUpdateOperationsInput | number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ConsentVersionCreateInput = {
    id?: string
    version: string
    content: string
    checksumSha256: string
    createdAt?: Date | string
    isActive?: boolean
    acceptances?: ConsentAcceptanceCreateNestedManyWithoutConsentVersionInput
  }

  export type ConsentVersionUncheckedCreateInput = {
    id?: string
    version: string
    content: string
    checksumSha256: string
    createdAt?: Date | string
    isActive?: boolean
    acceptances?: ConsentAcceptanceUncheckedCreateNestedManyWithoutConsentVersionInput
  }

  export type ConsentVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    checksumSha256?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    acceptances?: ConsentAcceptanceUpdateManyWithoutConsentVersionNestedInput
  }

  export type ConsentVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    checksumSha256?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    acceptances?: ConsentAcceptanceUncheckedUpdateManyWithoutConsentVersionNestedInput
  }

  export type ConsentVersionCreateManyInput = {
    id?: string
    version: string
    content: string
    checksumSha256: string
    createdAt?: Date | string
    isActive?: boolean
  }

  export type ConsentVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    checksumSha256?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ConsentVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    checksumSha256?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ConsentAcceptanceCreateInput = {
    id?: string
    acceptedAt?: Date | string
    ipHash?: string | null
    userAgent?: string | null
    locale?: string | null
    consentVersion: ConsentVersionCreateNestedOneWithoutAcceptancesInput
    intake: ContactIntakeCreateNestedOneWithoutConsentAcceptancesInput
  }

  export type ConsentAcceptanceUncheckedCreateInput = {
    id?: string
    consentVersionId: string
    intakeId: string
    acceptedAt?: Date | string
    ipHash?: string | null
    userAgent?: string | null
    locale?: string | null
  }

  export type ConsentAcceptanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    acceptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    consentVersion?: ConsentVersionUpdateOneRequiredWithoutAcceptancesNestedInput
    intake?: ContactIntakeUpdateOneRequiredWithoutConsentAcceptancesNestedInput
  }

  export type ConsentAcceptanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentVersionId?: StringFieldUpdateOperationsInput | string
    intakeId?: StringFieldUpdateOperationsInput | string
    acceptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConsentAcceptanceCreateManyInput = {
    id?: string
    consentVersionId: string
    intakeId: string
    acceptedAt?: Date | string
    ipHash?: string | null
    userAgent?: string | null
    locale?: string | null
  }

  export type ConsentAcceptanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    acceptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConsentAcceptanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentVersionId?: StringFieldUpdateOperationsInput | string
    intakeId?: StringFieldUpdateOperationsInput | string
    acceptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type EnumIntakeToneFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakeTone | EnumIntakeToneFieldRefInput<$PrismaModel>
    in?: $Enums.IntakeTone[] | ListEnumIntakeToneFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakeTone[] | ListEnumIntakeToneFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakeToneFilter<$PrismaModel> | $Enums.IntakeTone
  }

  export type EnumIntakePriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakePriority | EnumIntakePriorityFieldRefInput<$PrismaModel>
    in?: $Enums.IntakePriority[] | ListEnumIntakePriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakePriority[] | ListEnumIntakePriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakePriorityFilter<$PrismaModel> | $Enums.IntakePriority
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

  export type EnumIntakeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakeStatus | EnumIntakeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IntakeStatus[] | ListEnumIntakeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakeStatus[] | ListEnumIntakeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakeStatusFilter<$PrismaModel> | $Enums.IntakeStatus
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ConsentAcceptanceListRelationFilter = {
    every?: ConsentAcceptanceWhereInput
    some?: ConsentAcceptanceWhereInput
    none?: ConsentAcceptanceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ConsentAcceptanceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContactIntakeCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    tone?: SortOrder
    route?: SortOrder
    priority?: SortOrder
    name?: SortOrder
    email?: SortOrder
    message?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    spamScore?: SortOrder
    meta?: SortOrder
  }

  export type ContactIntakeAvgOrderByAggregateInput = {
    spamScore?: SortOrder
  }

  export type ContactIntakeMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    tone?: SortOrder
    route?: SortOrder
    priority?: SortOrder
    name?: SortOrder
    email?: SortOrder
    message?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    spamScore?: SortOrder
  }

  export type ContactIntakeMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    tone?: SortOrder
    route?: SortOrder
    priority?: SortOrder
    name?: SortOrder
    email?: SortOrder
    message?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    spamScore?: SortOrder
  }

  export type ContactIntakeSumOrderByAggregateInput = {
    spamScore?: SortOrder
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

  export type EnumIntakeToneWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakeTone | EnumIntakeToneFieldRefInput<$PrismaModel>
    in?: $Enums.IntakeTone[] | ListEnumIntakeToneFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakeTone[] | ListEnumIntakeToneFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakeToneWithAggregatesFilter<$PrismaModel> | $Enums.IntakeTone
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntakeToneFilter<$PrismaModel>
    _max?: NestedEnumIntakeToneFilter<$PrismaModel>
  }

  export type EnumIntakePriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakePriority | EnumIntakePriorityFieldRefInput<$PrismaModel>
    in?: $Enums.IntakePriority[] | ListEnumIntakePriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakePriority[] | ListEnumIntakePriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakePriorityWithAggregatesFilter<$PrismaModel> | $Enums.IntakePriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntakePriorityFilter<$PrismaModel>
    _max?: NestedEnumIntakePriorityFilter<$PrismaModel>
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

  export type EnumIntakeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakeStatus | EnumIntakeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IntakeStatus[] | ListEnumIntakeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakeStatus[] | ListEnumIntakeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakeStatusWithAggregatesFilter<$PrismaModel> | $Enums.IntakeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntakeStatusFilter<$PrismaModel>
    _max?: NestedEnumIntakeStatusFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ConsentVersionCountOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    content?: SortOrder
    checksumSha256?: SortOrder
    createdAt?: SortOrder
    isActive?: SortOrder
  }

  export type ConsentVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    content?: SortOrder
    checksumSha256?: SortOrder
    createdAt?: SortOrder
    isActive?: SortOrder
  }

  export type ConsentVersionMinOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    content?: SortOrder
    checksumSha256?: SortOrder
    createdAt?: SortOrder
    isActive?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ConsentVersionScalarRelationFilter = {
    is?: ConsentVersionWhereInput
    isNot?: ConsentVersionWhereInput
  }

  export type ContactIntakeScalarRelationFilter = {
    is?: ContactIntakeWhereInput
    isNot?: ContactIntakeWhereInput
  }

  export type ConsentAcceptanceCountOrderByAggregateInput = {
    id?: SortOrder
    consentVersionId?: SortOrder
    intakeId?: SortOrder
    acceptedAt?: SortOrder
    ipHash?: SortOrder
    userAgent?: SortOrder
    locale?: SortOrder
  }

  export type ConsentAcceptanceMaxOrderByAggregateInput = {
    id?: SortOrder
    consentVersionId?: SortOrder
    intakeId?: SortOrder
    acceptedAt?: SortOrder
    ipHash?: SortOrder
    userAgent?: SortOrder
    locale?: SortOrder
  }

  export type ConsentAcceptanceMinOrderByAggregateInput = {
    id?: SortOrder
    consentVersionId?: SortOrder
    intakeId?: SortOrder
    acceptedAt?: SortOrder
    ipHash?: SortOrder
    userAgent?: SortOrder
    locale?: SortOrder
  }

  export type ConsentAcceptanceCreateNestedManyWithoutIntakeInput = {
    create?: XOR<ConsentAcceptanceCreateWithoutIntakeInput, ConsentAcceptanceUncheckedCreateWithoutIntakeInput> | ConsentAcceptanceCreateWithoutIntakeInput[] | ConsentAcceptanceUncheckedCreateWithoutIntakeInput[]
    connectOrCreate?: ConsentAcceptanceCreateOrConnectWithoutIntakeInput | ConsentAcceptanceCreateOrConnectWithoutIntakeInput[]
    createMany?: ConsentAcceptanceCreateManyIntakeInputEnvelope
    connect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
  }

  export type ConsentAcceptanceUncheckedCreateNestedManyWithoutIntakeInput = {
    create?: XOR<ConsentAcceptanceCreateWithoutIntakeInput, ConsentAcceptanceUncheckedCreateWithoutIntakeInput> | ConsentAcceptanceCreateWithoutIntakeInput[] | ConsentAcceptanceUncheckedCreateWithoutIntakeInput[]
    connectOrCreate?: ConsentAcceptanceCreateOrConnectWithoutIntakeInput | ConsentAcceptanceCreateOrConnectWithoutIntakeInput[]
    createMany?: ConsentAcceptanceCreateManyIntakeInputEnvelope
    connect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumIntakeToneFieldUpdateOperationsInput = {
    set?: $Enums.IntakeTone
  }

  export type EnumIntakePriorityFieldUpdateOperationsInput = {
    set?: $Enums.IntakePriority
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumIntakeStatusFieldUpdateOperationsInput = {
    set?: $Enums.IntakeStatus
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ConsentAcceptanceUpdateManyWithoutIntakeNestedInput = {
    create?: XOR<ConsentAcceptanceCreateWithoutIntakeInput, ConsentAcceptanceUncheckedCreateWithoutIntakeInput> | ConsentAcceptanceCreateWithoutIntakeInput[] | ConsentAcceptanceUncheckedCreateWithoutIntakeInput[]
    connectOrCreate?: ConsentAcceptanceCreateOrConnectWithoutIntakeInput | ConsentAcceptanceCreateOrConnectWithoutIntakeInput[]
    upsert?: ConsentAcceptanceUpsertWithWhereUniqueWithoutIntakeInput | ConsentAcceptanceUpsertWithWhereUniqueWithoutIntakeInput[]
    createMany?: ConsentAcceptanceCreateManyIntakeInputEnvelope
    set?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    disconnect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    delete?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    connect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    update?: ConsentAcceptanceUpdateWithWhereUniqueWithoutIntakeInput | ConsentAcceptanceUpdateWithWhereUniqueWithoutIntakeInput[]
    updateMany?: ConsentAcceptanceUpdateManyWithWhereWithoutIntakeInput | ConsentAcceptanceUpdateManyWithWhereWithoutIntakeInput[]
    deleteMany?: ConsentAcceptanceScalarWhereInput | ConsentAcceptanceScalarWhereInput[]
  }

  export type ConsentAcceptanceUncheckedUpdateManyWithoutIntakeNestedInput = {
    create?: XOR<ConsentAcceptanceCreateWithoutIntakeInput, ConsentAcceptanceUncheckedCreateWithoutIntakeInput> | ConsentAcceptanceCreateWithoutIntakeInput[] | ConsentAcceptanceUncheckedCreateWithoutIntakeInput[]
    connectOrCreate?: ConsentAcceptanceCreateOrConnectWithoutIntakeInput | ConsentAcceptanceCreateOrConnectWithoutIntakeInput[]
    upsert?: ConsentAcceptanceUpsertWithWhereUniqueWithoutIntakeInput | ConsentAcceptanceUpsertWithWhereUniqueWithoutIntakeInput[]
    createMany?: ConsentAcceptanceCreateManyIntakeInputEnvelope
    set?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    disconnect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    delete?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    connect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    update?: ConsentAcceptanceUpdateWithWhereUniqueWithoutIntakeInput | ConsentAcceptanceUpdateWithWhereUniqueWithoutIntakeInput[]
    updateMany?: ConsentAcceptanceUpdateManyWithWhereWithoutIntakeInput | ConsentAcceptanceUpdateManyWithWhereWithoutIntakeInput[]
    deleteMany?: ConsentAcceptanceScalarWhereInput | ConsentAcceptanceScalarWhereInput[]
  }

  export type ConsentAcceptanceCreateNestedManyWithoutConsentVersionInput = {
    create?: XOR<ConsentAcceptanceCreateWithoutConsentVersionInput, ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput> | ConsentAcceptanceCreateWithoutConsentVersionInput[] | ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput[]
    connectOrCreate?: ConsentAcceptanceCreateOrConnectWithoutConsentVersionInput | ConsentAcceptanceCreateOrConnectWithoutConsentVersionInput[]
    createMany?: ConsentAcceptanceCreateManyConsentVersionInputEnvelope
    connect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
  }

  export type ConsentAcceptanceUncheckedCreateNestedManyWithoutConsentVersionInput = {
    create?: XOR<ConsentAcceptanceCreateWithoutConsentVersionInput, ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput> | ConsentAcceptanceCreateWithoutConsentVersionInput[] | ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput[]
    connectOrCreate?: ConsentAcceptanceCreateOrConnectWithoutConsentVersionInput | ConsentAcceptanceCreateOrConnectWithoutConsentVersionInput[]
    createMany?: ConsentAcceptanceCreateManyConsentVersionInputEnvelope
    connect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ConsentAcceptanceUpdateManyWithoutConsentVersionNestedInput = {
    create?: XOR<ConsentAcceptanceCreateWithoutConsentVersionInput, ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput> | ConsentAcceptanceCreateWithoutConsentVersionInput[] | ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput[]
    connectOrCreate?: ConsentAcceptanceCreateOrConnectWithoutConsentVersionInput | ConsentAcceptanceCreateOrConnectWithoutConsentVersionInput[]
    upsert?: ConsentAcceptanceUpsertWithWhereUniqueWithoutConsentVersionInput | ConsentAcceptanceUpsertWithWhereUniqueWithoutConsentVersionInput[]
    createMany?: ConsentAcceptanceCreateManyConsentVersionInputEnvelope
    set?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    disconnect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    delete?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    connect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    update?: ConsentAcceptanceUpdateWithWhereUniqueWithoutConsentVersionInput | ConsentAcceptanceUpdateWithWhereUniqueWithoutConsentVersionInput[]
    updateMany?: ConsentAcceptanceUpdateManyWithWhereWithoutConsentVersionInput | ConsentAcceptanceUpdateManyWithWhereWithoutConsentVersionInput[]
    deleteMany?: ConsentAcceptanceScalarWhereInput | ConsentAcceptanceScalarWhereInput[]
  }

  export type ConsentAcceptanceUncheckedUpdateManyWithoutConsentVersionNestedInput = {
    create?: XOR<ConsentAcceptanceCreateWithoutConsentVersionInput, ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput> | ConsentAcceptanceCreateWithoutConsentVersionInput[] | ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput[]
    connectOrCreate?: ConsentAcceptanceCreateOrConnectWithoutConsentVersionInput | ConsentAcceptanceCreateOrConnectWithoutConsentVersionInput[]
    upsert?: ConsentAcceptanceUpsertWithWhereUniqueWithoutConsentVersionInput | ConsentAcceptanceUpsertWithWhereUniqueWithoutConsentVersionInput[]
    createMany?: ConsentAcceptanceCreateManyConsentVersionInputEnvelope
    set?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    disconnect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    delete?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    connect?: ConsentAcceptanceWhereUniqueInput | ConsentAcceptanceWhereUniqueInput[]
    update?: ConsentAcceptanceUpdateWithWhereUniqueWithoutConsentVersionInput | ConsentAcceptanceUpdateWithWhereUniqueWithoutConsentVersionInput[]
    updateMany?: ConsentAcceptanceUpdateManyWithWhereWithoutConsentVersionInput | ConsentAcceptanceUpdateManyWithWhereWithoutConsentVersionInput[]
    deleteMany?: ConsentAcceptanceScalarWhereInput | ConsentAcceptanceScalarWhereInput[]
  }

  export type ConsentVersionCreateNestedOneWithoutAcceptancesInput = {
    create?: XOR<ConsentVersionCreateWithoutAcceptancesInput, ConsentVersionUncheckedCreateWithoutAcceptancesInput>
    connectOrCreate?: ConsentVersionCreateOrConnectWithoutAcceptancesInput
    connect?: ConsentVersionWhereUniqueInput
  }

  export type ContactIntakeCreateNestedOneWithoutConsentAcceptancesInput = {
    create?: XOR<ContactIntakeCreateWithoutConsentAcceptancesInput, ContactIntakeUncheckedCreateWithoutConsentAcceptancesInput>
    connectOrCreate?: ContactIntakeCreateOrConnectWithoutConsentAcceptancesInput
    connect?: ContactIntakeWhereUniqueInput
  }

  export type ConsentVersionUpdateOneRequiredWithoutAcceptancesNestedInput = {
    create?: XOR<ConsentVersionCreateWithoutAcceptancesInput, ConsentVersionUncheckedCreateWithoutAcceptancesInput>
    connectOrCreate?: ConsentVersionCreateOrConnectWithoutAcceptancesInput
    upsert?: ConsentVersionUpsertWithoutAcceptancesInput
    connect?: ConsentVersionWhereUniqueInput
    update?: XOR<XOR<ConsentVersionUpdateToOneWithWhereWithoutAcceptancesInput, ConsentVersionUpdateWithoutAcceptancesInput>, ConsentVersionUncheckedUpdateWithoutAcceptancesInput>
  }

  export type ContactIntakeUpdateOneRequiredWithoutConsentAcceptancesNestedInput = {
    create?: XOR<ContactIntakeCreateWithoutConsentAcceptancesInput, ContactIntakeUncheckedCreateWithoutConsentAcceptancesInput>
    connectOrCreate?: ContactIntakeCreateOrConnectWithoutConsentAcceptancesInput
    upsert?: ContactIntakeUpsertWithoutConsentAcceptancesInput
    connect?: ContactIntakeWhereUniqueInput
    update?: XOR<XOR<ContactIntakeUpdateToOneWithWhereWithoutConsentAcceptancesInput, ContactIntakeUpdateWithoutConsentAcceptancesInput>, ContactIntakeUncheckedUpdateWithoutConsentAcceptancesInput>
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

  export type NestedEnumIntakeToneFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakeTone | EnumIntakeToneFieldRefInput<$PrismaModel>
    in?: $Enums.IntakeTone[] | ListEnumIntakeToneFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakeTone[] | ListEnumIntakeToneFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakeToneFilter<$PrismaModel> | $Enums.IntakeTone
  }

  export type NestedEnumIntakePriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakePriority | EnumIntakePriorityFieldRefInput<$PrismaModel>
    in?: $Enums.IntakePriority[] | ListEnumIntakePriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakePriority[] | ListEnumIntakePriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakePriorityFilter<$PrismaModel> | $Enums.IntakePriority
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

  export type NestedEnumIntakeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakeStatus | EnumIntakeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IntakeStatus[] | ListEnumIntakeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakeStatus[] | ListEnumIntakeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakeStatusFilter<$PrismaModel> | $Enums.IntakeStatus
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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

  export type NestedEnumIntakeToneWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakeTone | EnumIntakeToneFieldRefInput<$PrismaModel>
    in?: $Enums.IntakeTone[] | ListEnumIntakeToneFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakeTone[] | ListEnumIntakeToneFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakeToneWithAggregatesFilter<$PrismaModel> | $Enums.IntakeTone
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntakeToneFilter<$PrismaModel>
    _max?: NestedEnumIntakeToneFilter<$PrismaModel>
  }

  export type NestedEnumIntakePriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakePriority | EnumIntakePriorityFieldRefInput<$PrismaModel>
    in?: $Enums.IntakePriority[] | ListEnumIntakePriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakePriority[] | ListEnumIntakePriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakePriorityWithAggregatesFilter<$PrismaModel> | $Enums.IntakePriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntakePriorityFilter<$PrismaModel>
    _max?: NestedEnumIntakePriorityFilter<$PrismaModel>
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

  export type NestedEnumIntakeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntakeStatus | EnumIntakeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IntakeStatus[] | ListEnumIntakeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntakeStatus[] | ListEnumIntakeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumIntakeStatusWithAggregatesFilter<$PrismaModel> | $Enums.IntakeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntakeStatusFilter<$PrismaModel>
    _max?: NestedEnumIntakeStatusFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ConsentAcceptanceCreateWithoutIntakeInput = {
    id?: string
    acceptedAt?: Date | string
    ipHash?: string | null
    userAgent?: string | null
    locale?: string | null
    consentVersion: ConsentVersionCreateNestedOneWithoutAcceptancesInput
  }

  export type ConsentAcceptanceUncheckedCreateWithoutIntakeInput = {
    id?: string
    consentVersionId: string
    acceptedAt?: Date | string
    ipHash?: string | null
    userAgent?: string | null
    locale?: string | null
  }

  export type ConsentAcceptanceCreateOrConnectWithoutIntakeInput = {
    where: ConsentAcceptanceWhereUniqueInput
    create: XOR<ConsentAcceptanceCreateWithoutIntakeInput, ConsentAcceptanceUncheckedCreateWithoutIntakeInput>
  }

  export type ConsentAcceptanceCreateManyIntakeInputEnvelope = {
    data: ConsentAcceptanceCreateManyIntakeInput | ConsentAcceptanceCreateManyIntakeInput[]
    skipDuplicates?: boolean
  }

  export type ConsentAcceptanceUpsertWithWhereUniqueWithoutIntakeInput = {
    where: ConsentAcceptanceWhereUniqueInput
    update: XOR<ConsentAcceptanceUpdateWithoutIntakeInput, ConsentAcceptanceUncheckedUpdateWithoutIntakeInput>
    create: XOR<ConsentAcceptanceCreateWithoutIntakeInput, ConsentAcceptanceUncheckedCreateWithoutIntakeInput>
  }

  export type ConsentAcceptanceUpdateWithWhereUniqueWithoutIntakeInput = {
    where: ConsentAcceptanceWhereUniqueInput
    data: XOR<ConsentAcceptanceUpdateWithoutIntakeInput, ConsentAcceptanceUncheckedUpdateWithoutIntakeInput>
  }

  export type ConsentAcceptanceUpdateManyWithWhereWithoutIntakeInput = {
    where: ConsentAcceptanceScalarWhereInput
    data: XOR<ConsentAcceptanceUpdateManyMutationInput, ConsentAcceptanceUncheckedUpdateManyWithoutIntakeInput>
  }

  export type ConsentAcceptanceScalarWhereInput = {
    AND?: ConsentAcceptanceScalarWhereInput | ConsentAcceptanceScalarWhereInput[]
    OR?: ConsentAcceptanceScalarWhereInput[]
    NOT?: ConsentAcceptanceScalarWhereInput | ConsentAcceptanceScalarWhereInput[]
    id?: StringFilter<"ConsentAcceptance"> | string
    consentVersionId?: StringFilter<"ConsentAcceptance"> | string
    intakeId?: StringFilter<"ConsentAcceptance"> | string
    acceptedAt?: DateTimeFilter<"ConsentAcceptance"> | Date | string
    ipHash?: StringNullableFilter<"ConsentAcceptance"> | string | null
    userAgent?: StringNullableFilter<"ConsentAcceptance"> | string | null
    locale?: StringNullableFilter<"ConsentAcceptance"> | string | null
  }

  export type ConsentAcceptanceCreateWithoutConsentVersionInput = {
    id?: string
    acceptedAt?: Date | string
    ipHash?: string | null
    userAgent?: string | null
    locale?: string | null
    intake: ContactIntakeCreateNestedOneWithoutConsentAcceptancesInput
  }

  export type ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput = {
    id?: string
    intakeId: string
    acceptedAt?: Date | string
    ipHash?: string | null
    userAgent?: string | null
    locale?: string | null
  }

  export type ConsentAcceptanceCreateOrConnectWithoutConsentVersionInput = {
    where: ConsentAcceptanceWhereUniqueInput
    create: XOR<ConsentAcceptanceCreateWithoutConsentVersionInput, ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput>
  }

  export type ConsentAcceptanceCreateManyConsentVersionInputEnvelope = {
    data: ConsentAcceptanceCreateManyConsentVersionInput | ConsentAcceptanceCreateManyConsentVersionInput[]
    skipDuplicates?: boolean
  }

  export type ConsentAcceptanceUpsertWithWhereUniqueWithoutConsentVersionInput = {
    where: ConsentAcceptanceWhereUniqueInput
    update: XOR<ConsentAcceptanceUpdateWithoutConsentVersionInput, ConsentAcceptanceUncheckedUpdateWithoutConsentVersionInput>
    create: XOR<ConsentAcceptanceCreateWithoutConsentVersionInput, ConsentAcceptanceUncheckedCreateWithoutConsentVersionInput>
  }

  export type ConsentAcceptanceUpdateWithWhereUniqueWithoutConsentVersionInput = {
    where: ConsentAcceptanceWhereUniqueInput
    data: XOR<ConsentAcceptanceUpdateWithoutConsentVersionInput, ConsentAcceptanceUncheckedUpdateWithoutConsentVersionInput>
  }

  export type ConsentAcceptanceUpdateManyWithWhereWithoutConsentVersionInput = {
    where: ConsentAcceptanceScalarWhereInput
    data: XOR<ConsentAcceptanceUpdateManyMutationInput, ConsentAcceptanceUncheckedUpdateManyWithoutConsentVersionInput>
  }

  export type ConsentVersionCreateWithoutAcceptancesInput = {
    id?: string
    version: string
    content: string
    checksumSha256: string
    createdAt?: Date | string
    isActive?: boolean
  }

  export type ConsentVersionUncheckedCreateWithoutAcceptancesInput = {
    id?: string
    version: string
    content: string
    checksumSha256: string
    createdAt?: Date | string
    isActive?: boolean
  }

  export type ConsentVersionCreateOrConnectWithoutAcceptancesInput = {
    where: ConsentVersionWhereUniqueInput
    create: XOR<ConsentVersionCreateWithoutAcceptancesInput, ConsentVersionUncheckedCreateWithoutAcceptancesInput>
  }

  export type ContactIntakeCreateWithoutConsentAcceptancesInput = {
    id?: string
    createdAt?: Date | string
    tone: $Enums.IntakeTone
    route: string
    priority: $Enums.IntakePriority
    name?: string | null
    email: string
    message: string
    phone?: string | null
    status?: $Enums.IntakeStatus
    spamScore?: number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ContactIntakeUncheckedCreateWithoutConsentAcceptancesInput = {
    id?: string
    createdAt?: Date | string
    tone: $Enums.IntakeTone
    route: string
    priority: $Enums.IntakePriority
    name?: string | null
    email: string
    message: string
    phone?: string | null
    status?: $Enums.IntakeStatus
    spamScore?: number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ContactIntakeCreateOrConnectWithoutConsentAcceptancesInput = {
    where: ContactIntakeWhereUniqueInput
    create: XOR<ContactIntakeCreateWithoutConsentAcceptancesInput, ContactIntakeUncheckedCreateWithoutConsentAcceptancesInput>
  }

  export type ConsentVersionUpsertWithoutAcceptancesInput = {
    update: XOR<ConsentVersionUpdateWithoutAcceptancesInput, ConsentVersionUncheckedUpdateWithoutAcceptancesInput>
    create: XOR<ConsentVersionCreateWithoutAcceptancesInput, ConsentVersionUncheckedCreateWithoutAcceptancesInput>
    where?: ConsentVersionWhereInput
  }

  export type ConsentVersionUpdateToOneWithWhereWithoutAcceptancesInput = {
    where?: ConsentVersionWhereInput
    data: XOR<ConsentVersionUpdateWithoutAcceptancesInput, ConsentVersionUncheckedUpdateWithoutAcceptancesInput>
  }

  export type ConsentVersionUpdateWithoutAcceptancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    checksumSha256?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ConsentVersionUncheckedUpdateWithoutAcceptancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    checksumSha256?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ContactIntakeUpsertWithoutConsentAcceptancesInput = {
    update: XOR<ContactIntakeUpdateWithoutConsentAcceptancesInput, ContactIntakeUncheckedUpdateWithoutConsentAcceptancesInput>
    create: XOR<ContactIntakeCreateWithoutConsentAcceptancesInput, ContactIntakeUncheckedCreateWithoutConsentAcceptancesInput>
    where?: ContactIntakeWhereInput
  }

  export type ContactIntakeUpdateToOneWithWhereWithoutConsentAcceptancesInput = {
    where?: ContactIntakeWhereInput
    data: XOR<ContactIntakeUpdateWithoutConsentAcceptancesInput, ContactIntakeUncheckedUpdateWithoutConsentAcceptancesInput>
  }

  export type ContactIntakeUpdateWithoutConsentAcceptancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumIntakeToneFieldUpdateOperationsInput | $Enums.IntakeTone
    route?: StringFieldUpdateOperationsInput | string
    priority?: EnumIntakePriorityFieldUpdateOperationsInput | $Enums.IntakePriority
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIntakeStatusFieldUpdateOperationsInput | $Enums.IntakeStatus
    spamScore?: NullableFloatFieldUpdateOperationsInput | number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ContactIntakeUncheckedUpdateWithoutConsentAcceptancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumIntakeToneFieldUpdateOperationsInput | $Enums.IntakeTone
    route?: StringFieldUpdateOperationsInput | string
    priority?: EnumIntakePriorityFieldUpdateOperationsInput | $Enums.IntakePriority
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIntakeStatusFieldUpdateOperationsInput | $Enums.IntakeStatus
    spamScore?: NullableFloatFieldUpdateOperationsInput | number | null
    meta?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ConsentAcceptanceCreateManyIntakeInput = {
    id?: string
    consentVersionId: string
    acceptedAt?: Date | string
    ipHash?: string | null
    userAgent?: string | null
    locale?: string | null
  }

  export type ConsentAcceptanceUpdateWithoutIntakeInput = {
    id?: StringFieldUpdateOperationsInput | string
    acceptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    consentVersion?: ConsentVersionUpdateOneRequiredWithoutAcceptancesNestedInput
  }

  export type ConsentAcceptanceUncheckedUpdateWithoutIntakeInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentVersionId?: StringFieldUpdateOperationsInput | string
    acceptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConsentAcceptanceUncheckedUpdateManyWithoutIntakeInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentVersionId?: StringFieldUpdateOperationsInput | string
    acceptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConsentAcceptanceCreateManyConsentVersionInput = {
    id?: string
    intakeId: string
    acceptedAt?: Date | string
    ipHash?: string | null
    userAgent?: string | null
    locale?: string | null
  }

  export type ConsentAcceptanceUpdateWithoutConsentVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    acceptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    intake?: ContactIntakeUpdateOneRequiredWithoutConsentAcceptancesNestedInput
  }

  export type ConsentAcceptanceUncheckedUpdateWithoutConsentVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    intakeId?: StringFieldUpdateOperationsInput | string
    acceptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConsentAcceptanceUncheckedUpdateManyWithoutConsentVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    intakeId?: StringFieldUpdateOperationsInput | string
    acceptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
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