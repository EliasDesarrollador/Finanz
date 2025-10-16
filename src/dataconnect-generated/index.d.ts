import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Account_Key {
  id: UUIDString;
  __typename?: 'Account_Key';
}

export interface Budget_Key {
  id: UUIDString;
  __typename?: 'Budget_Key';
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateCategoryData {
  category_insert: Category_Key;
}

export interface CreateCategoryVariables {
  name: string;
  type: string;
  description?: string | null;
}

export interface CreateTransactionData {
  transaction_insert: Transaction_Key;
}

export interface CreateTransactionVariables {
  accountId: UUIDString;
  categoryId?: UUIDString | null;
  amount: number;
  date: DateString;
  description: string;
  type: string;
}

export interface ListCategoriesData {
  categories: ({
    id: UUIDString;
    name: string;
    type: string;
    description?: string | null;
  } & Category_Key)[];
}

export interface ListTransactionsData {
  transactions: ({
    id: UUIDString;
    amount: number;
    date: DateString;
    description: string;
    type: string;
  } & Transaction_Key)[];
}

export interface ListTransactionsVariables {
  accountId: UUIDString;
}

export interface Transaction_Key {
  id: UUIDString;
  __typename?: 'Transaction_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCategoryVariables): MutationRef<CreateCategoryData, CreateCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCategoryVariables): MutationRef<CreateCategoryData, CreateCategoryVariables>;
  operationName: string;
}
export const createCategoryRef: CreateCategoryRef;

export function createCategory(vars: CreateCategoryVariables): MutationPromise<CreateCategoryData, CreateCategoryVariables>;
export function createCategory(dc: DataConnect, vars: CreateCategoryVariables): MutationPromise<CreateCategoryData, CreateCategoryVariables>;

interface ListCategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCategoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCategoriesData, undefined>;
  operationName: string;
}
export const listCategoriesRef: ListCategoriesRef;

export function listCategories(): QueryPromise<ListCategoriesData, undefined>;
export function listCategories(dc: DataConnect): QueryPromise<ListCategoriesData, undefined>;

interface CreateTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
  operationName: string;
}
export const createTransactionRef: CreateTransactionRef;

export function createTransaction(vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;
export function createTransaction(dc: DataConnect, vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;

interface ListTransactionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
  operationName: string;
}
export const listTransactionsRef: ListTransactionsRef;

export function listTransactions(vars: ListTransactionsVariables): QueryPromise<ListTransactionsData, ListTransactionsVariables>;
export function listTransactions(dc: DataConnect, vars: ListTransactionsVariables): QueryPromise<ListTransactionsData, ListTransactionsVariables>;

