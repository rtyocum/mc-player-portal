package dev.rtyocum.mc;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class BanMessage {

    private String uuid;

    @JsonCreator
    public BanMessage(@JsonProperty("uuid") String uuid) {
        this.uuid = uuid;
    }

    public String getUuid() {
        return uuid;
    }
}
