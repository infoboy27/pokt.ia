// Fallback SDK file for POKT.ia Portal
// This file is generated when GraphQL codegen runs successfully
// For now, it provides basic types to prevent build failures

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

// Basic types that are commonly imported
export interface User {
  id: string;
  email: string;
  portalUserID: string;
}

export interface Account {
  id: string;
  name: string;
  payPlanType: PayPlanType;
}

export interface PortalApp {
  id: string;
  name: string;
  emoji: string;
}

export interface Blockchain {
  id: string;
  name: string;
  logo: string;
}

export interface D2Stats {
  id: string;
  // Add more properties as needed
}

export interface D2Log {
  id: string;
  // Add more properties as needed
}

export interface D2Meta {
  id: string;
  // Add more properties as needed
}

export interface D2Chain {
  id: string;
  // Add more properties as needed
}

export interface AccountUser {
  id: string;
  roleName: RoleName;
}

export interface Whitelists {
  id: string;
  // Add more properties as needed
}

export interface WhitelistContracts {
  id: string;
  // Add more properties as needed
}

export interface WhitelistMethods {
  id: string;
  // Add more properties as needed
}

export interface UpdateUser {
  id: string;
  // Add more properties as needed
}

export interface UpdatePortalApp {
  id: string;
  // Add more properties as needed
}

export interface PortalAppEnvironment {
  id: string;
  // Add more properties as needed
}

export interface NotificationEventEnum {
  // Add enum values as needed
}

export interface NotificationType {
  // Add enum values as needed
}

export interface SortOrder {
  // Add enum values as needed
}

export interface Maybe<T> {
  // Add more properties as needed
}

export interface BlockchainsQuery {
  // Add more properties as needed
}

export interface D2LogType {
  // Add enum values as needed
}

// Enums
export enum RoleName {
  Owner = "OWNER",
  Admin = "ADMIN",
  Member = "MEMBER",
}

export enum PayPlanType {
  Free = "FREE",
  Unlimited = "UNLIMITED",
  Enterprise = "ENTERPRISE",
}

// SDK function
export const getSdk = () => ({
  // Add SDK functions as needed
});

export const getSdkGen = getSdk;

// Export empty objects for now to prevent import errors
export const queries = {};
export const mutations = {}; 