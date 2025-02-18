package dev.rtyocum.mc;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerPreLoginEvent;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class EventListener implements Listener {
    @EventHandler
    public void onAsyncPlayerPreLoginEvent(AsyncPlayerPreLoginEvent event) {
        ObjectMapper mapper = new ObjectMapper();
        String uuid = event.getUniqueId().toString().replace("-", "");
        Map<String, String> body = new HashMap<>();
        body.put("uuid", uuid);
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
            Map<String, String> responseMap = mapper.readValue(response.body(),
                    new TypeReference<Map<String, String>>() {
                    });
            if (response.statusCode() == 200) {
                event.allow();
            } else {
                event.disallow(AsyncPlayerPreLoginEvent.Result.KICK_OTHER,
                        responseMap.get("error"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            event.disallow(AsyncPlayerPreLoginEvent.Result.KICK_OTHER,
                    "An error occurred while verifying your account.");
        }
    }

}
