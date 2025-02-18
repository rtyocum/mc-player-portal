// Bitwise permission roles

// Access permissions
export const VIEW_MEMBERSHIP = 1;
export const JOIN_SERVER = 2;
export const INVITE = 4;

export const BLOCKED = 0;
export const NONMEMBER = VIEW_MEMBERSHIP;
export const MEMBER = VIEW_MEMBERSHIP | JOIN_SERVER | INVITE;

// Admin permissions
export const VIEW_USERS = 8;
export const ADD_USER = 16;
export const EDIT_USER = 32;
export const EDIT_PERMISSIONS = 64;
export const DELETE_USER = 128;
