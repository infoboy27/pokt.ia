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
  planType: PayPlanType;
  enterpriseLimit: number;
  monthlyUserLimit: number;
  notifications: Array<{
    notificationType: NotificationType;
    notificationSettings: {
      accountID: string;
      type: NotificationType;
      active: boolean;
      destination: string;
      trigger: string;
      events: {
        full: boolean;
        half: boolean;
        quarter: boolean;
        signedUp: boolean;
        threeQuarters: boolean;
      };
    };
  }>;
  users: Array<{
    id: string;
    email: string;
    roleName: RoleName;
    accepted: boolean;
  }>;
  accountUsers: Array<{
    id: string;
    email: string;
    roleName: RoleName;
    accepted: boolean;
  }>;
  partnerChainIDs: string[];
  partnerThroughputLimit: number;
  partnerAppLimit: number;
  integrations: {
    stripeSubscriptionID: string;
    covalentAPIKeyFree: string;
    covalentAPIKeyPaid: string;
  };
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  portalApps: Array<{
    id: string;
    name: string;
    accountID: string;
    appEmoji: string;
    description: string;
    settings: {
      appID: string;
      environment: PortalAppEnvironment;
      secretKey: string;
      secretKeyRequired: boolean;
      favoritedChainIDs: string[];
    };
    whitelists: {
      origins: string[];
      userAgents: string[];
      blockchains: string[];
      contracts: string[];
      methods: string[];
    };
    aats: Array<{
      protocolAppID: string;
      aat: {
        id: string;
        appID: string;
        publicKey: string;
        address: string;
        clientPublicKey: string;
        signature: string;
        version: string;
      };
    }>;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
  }>;
  plan: {
    id: string;
    type: PayPlanType;
    monthlyRelayLimit: number;
    chainIDs: string[];
    throughputLimit: number;
    appLimit: number;
    dailyLimit: number;
  };
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

export enum D2StatsDuration {
  Date = "DATE",
  Hour = "HOUR",
}

export enum D2StatsView {
  ChainId = "CHAIN_ID",
  ApplicationId = "APPLICATION_ID",
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

export enum WhitelistType {
  Origins = "ORIGINS",
  Blockchains = "BLOCKCHAINS",
  UserAgents = "USER_AGENTS",
  Contracts = "CONTRACTS",
  Methods = "METHODS",
}

export interface UpdateUser {
  id: string;
  // Add more properties as needed
}

export interface UpdatePortalApp {
  id: string;
  // Add more properties as needed
}

export interface AdminUpdateAccountMutationVariables {
  id: string;
  // Add more properties as needed
}

export enum PortalAppEnvironment {
  Production = "PRODUCTION",
  Staging = "STAGING",
  Development = "DEVELOPMENT",
}

export enum NotificationEventEnum {
  AccountCreated = "ACCOUNT_CREATED",
  AccountUpdated = "ACCOUNT_UPDATED",
  AppCreated = "APP_CREATED",
  AppUpdated = "APP_UPDATED",
  AppDeleted = "APP_DELETED",
  MemberInvited = "MEMBER_INVITED",
  MemberJoined = "MEMBER_JOINED",
  MemberLeft = "MEMBER_LEFT",
  PlanUpgraded = "PLAN_UPGRADED",
  PlanDowngraded = "PLAN_DOWNGRADED",
}

export enum NotificationType {
  Email = "EMAIL",
  Push = "PUSH",
  InApp = "IN_APP",
}

export enum SortOrder {
  Asc = "ASC",
  Desc = "DESC",
}

export type Maybe<T> = T | null | undefined;

export interface BlockchainsQuery {
  // Add more properties as needed
}

export enum D2LogType {
  ErrorLogs = "ERROR_LOGS",
  NoErrorLogs = "NO_ERROR_LOGS",
  AllLogs = "ALL_LOGS",
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