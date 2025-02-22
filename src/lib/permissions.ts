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
export const VIEW_NAMES_EMAILS = 16;
export const ADD_USER = 32;
export const EDIT_USER = 64;
export const EDIT_PERMISSIONS = 128;
export const DELETE_USER = 256;
export const VIEW_INVITES = 512;
export const ADD_INVITE = 1024;
export const DELETE_INVITE = 2048;

export const PERMISSIONS = [
  { name: "View Membership", value: VIEW_MEMBERSHIP },
  { name: "Join Server", value: JOIN_SERVER },
  { name: "Invite", value: INVITE },
  { name: "View Users", value: VIEW_USERS },
  { name: "View Names & Emails", value: VIEW_NAMES_EMAILS },
  { name: "Add User", value: ADD_USER },
  { name: "Edit User", value: EDIT_USER },
  { name: "Edit Permissions", value: EDIT_PERMISSIONS },
  { name: "Delete User", value: DELETE_USER },
  { name: "View Invites", value: VIEW_INVITES },
  { name: "Add Invite", value: ADD_INVITE },
  { name: "Delete Invite", value: DELETE_INVITE },
];
