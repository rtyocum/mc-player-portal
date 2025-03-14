package dev.rtyocum.mc;

public class Permissions {
    public static final int VIEW_MEMBERSHIP = 1;
    public static final int JOIN_SERVER = 2;
    public static final int INVITE = 4;

    public static final int BLOCKED = 0;
    public static final int NONMEMBER = VIEW_MEMBERSHIP;
    public static final int MEMBER = VIEW_MEMBERSHIP | JOIN_SERVER | INVITE;

    // Admin permissions
    public static final int VIEW_USERS = 8;
    public static final int VIEW_NAMES_EMAILS = 16;
    public static final int EDIT_USER = 64;
    public static final int EDIT_PERMISSIONS = 128;
    public static final int DELETE_USER = 256;
    public static final int VIEW_INVITES = 512;
    public static final int ADD_INVITE = 1024;
    public static final int DELETE_INVITE = 2048;

    // In-game server roles (LuckPerms)
    public static final int LP_MEMBER = 4096;
    public static final int LP_ADMIN = 16384;
    public static final int LP_EDITOR = 32768;
}
