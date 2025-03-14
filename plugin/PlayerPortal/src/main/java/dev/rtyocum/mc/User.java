package dev.rtyocum.mc;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class User {
    private UUID uuid;
    private String username;
    private int permission;

    @JsonCreator
    public User(@JsonProperty("uuid") String uuid, @JsonProperty("username") String username,
            @JsonProperty("permission") int permission) {
        UUID uuidObj = UUID.fromString(uuid.replaceFirst(
                "(\\p{XDigit}{8})(\\p{XDigit}{4})(\\p{XDigit}{4})(\\p{XDigit}{4})(\\p{XDigit}+)", "$1-$2-$3-$4-$5"));
        this.uuid = uuidObj;
        this.username = username;
        this.permission = permission;
    }

    public UUID getUuid() {
        return uuid;
    }

    public String getUsername() {
        return username;
    }

    public int getPermission() {
        return permission;
    }
}
