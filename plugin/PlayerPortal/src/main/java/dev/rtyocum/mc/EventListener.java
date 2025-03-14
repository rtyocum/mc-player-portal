package dev.rtyocum.mc;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerPreLoginEvent;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class EventListener implements Listener {
    @EventHandler
    public void onAsyncPlayerPreLoginEvent(AsyncPlayerPreLoginEvent event) {
        ObjectMapper mapper = new ObjectMapper();
        UUID uuid = event.getUniqueId();
        Map<String, String> body = new HashMap<>();
        body.put("uuid", uuid.toString().replace("-", ""));
        try {
            String json = mapper.writeValueAsString(body);
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .version(HttpClient.Version.HTTP_1_1)
                    .uri(URI.create("http://localhost:3000/api/verify"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();
            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 404) {
                event.disallow(AsyncPlayerPreLoginEvent.Result.KICK_OTHER,
                        "You must be a member to join this server. If you have an invite, you must claim it before joining.");
                return;
            } else if (response.statusCode() != 200) {
                event.disallow(AsyncPlayerPreLoginEvent.Result.KICK_OTHER,
                        "An error occurred while verifying your account.");
                return;
            }
            Map<String, Integer> responseMap = mapper.readValue(response.body(),
                    new TypeReference<Map<String, Integer>>() {
                    });
            int permission = responseMap.get("permission");

            if (permission == Permissions.BLOCKED) {
                event.disallow(AsyncPlayerPreLoginEvent.Result.KICK_OTHER,
                        "You are not allowed to join this server.");
                return;
            } else if ((permission & Permissions.JOIN_SERVER) == 0) {
                event.disallow(AsyncPlayerPreLoginEvent.Result.KICK_OTHER,
                        "You must be a member to join this server.");
                return;
            }

            event.allow();

        } catch (Exception e) {
            e.printStackTrace();
            event.disallow(AsyncPlayerPreLoginEvent.Result.KICK_OTHER,
                    "An error occurred while verifying your account.");
            return;
        }
    }

}
