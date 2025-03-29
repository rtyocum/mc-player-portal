package dev.rtyocum.mc;

import org.bukkit.Bukkit;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.plugin.RegisteredServiceProvider;
import org.bukkit.plugin.java.JavaPlugin;

import net.luckperms.api.LuckPerms;
import net.luckperms.api.model.user.UserManager;
import net.luckperms.api.node.NodeType;
import net.luckperms.api.node.types.InheritanceNode;
import net.luckperms.api.node.types.PermissionNode;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.Set;
import java.util.concurrent.TimeoutException;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.DeliverCallback;

/**
 * Hello world!
 */
public class Main extends JavaPlugin {
    FileConfiguration config = getConfig();

    @Override
    public void onEnable() {
        config.addDefault("mq.uri", "amqp://guest:guest@localhost:5672");
        config.options().copyDefaults(true);
        saveConfig();
        getServer().getPluginManager().registerEvents(new EventListener(), this);
        getCommand("ban").setExecutor(new CommandBan());
        try {
            String uri = config.getString("mq.uri");
            startMQService(uri);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDisable() {
        // Close the MQ service
        try {
            MQ.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void startMQService(String uri)
            throws IOException, TimeoutException, KeyManagementException, NoSuchAlgorithmException, URISyntaxException {
        // Start the MQ service
        ObjectMapper objectMapper = new ObjectMapper();
        Logger logger = Bukkit.getLogger();

        MQ.init(uri);

        DeliverCallback createDeliverCallback = (consumerTag, delivery) -> {
            try {
                User mqUser = objectMapper.readValue(new String(delivery.getBody(), "UTF-8"), User.class);
                logger.log(Level.INFO, "MQ Queue user.created: " + mqUser.getUsername());
                updateLPPermissions(mqUser);
            } finally {
                MQ.ack(delivery.getEnvelope().getDeliveryTag());
            }
        };

        MQ.consume("user.create", createDeliverCallback);

        DeliverCallback deleteDeliverCallback = (consumerTag, delivery) -> {
            try {
                User mqUser = objectMapper.readValue(new String(delivery.getBody(), "UTF-8"), User.class);
                logger.log(Level.INFO, "MQ Queue user.deleted: " + mqUser.getUsername());
                deleteLPPermissions(mqUser);
            } finally {
                MQ.ack(delivery.getEnvelope().getDeliveryTag());
            }
        };
        MQ.consume("user.delete", deleteDeliverCallback);

        DeliverCallback updateDeliverCallback = (consumerTag, delivery) -> {
            try {
                User mqUser = objectMapper.readValue(new String(delivery.getBody(), "UTF-8"), User.class);
                logger.log(Level.INFO, "MQ Queue user.update: " + mqUser.getUsername());
                updateLPPermissions(mqUser);
            } finally {
                MQ.ack(delivery.getEnvelope().getDeliveryTag());
            }
        };
        MQ.consume("user.update", updateDeliverCallback);

    }

    private void updateLPPermissions(User user2) {
        // if user is no longer allowed to join, if on server, kick them
        if ((user2.getPermission() & Permissions.JOIN_SERVER) == 0) {
            Bukkit.getScheduler().runTask(this, () -> {
                Bukkit.getPlayer(user2.getUuid()).kickPlayer("You are no longer allowed to join the server.");
            });
        }

        RegisteredServiceProvider<LuckPerms> provider = Bukkit.getServicesManager()
                .getRegistration(LuckPerms.class);
        if (provider != null) {
            LuckPerms api = provider.getProvider();
            UserManager userManager = api.getUserManager();

            userManager.modifyUser(user2.getUuid(), user -> {
                Set<String> groups = user.getNodes(NodeType.INHERITANCE).stream()
                        .map(InheritanceNode::getGroupName)
                        .collect(Collectors.toSet());

                boolean member = groups.contains("member");
                boolean admin = groups.contains("admin");

                if (!member && (user2.getPermission() & Permissions.LP_MEMBER) != 0) {
                    user.data().add(InheritanceNode.builder("member").build());
                } else if (member && (user2.getPermission() & Permissions.LP_MEMBER) == 0) {
                    user.data().remove(InheritanceNode.builder("member").build());
                }

                if (!admin && (user2.getPermission() & Permissions.LP_ADMIN) != 0) {
                    user.data().add(InheritanceNode.builder("admin").build());
                } else if (admin && (user2.getPermission() & Permissions.LP_ADMIN) == 0) {
                    user.data().remove(InheritanceNode.builder("admin").build());
                }

                boolean canEdit = user.getNodes(NodeType.PERMISSION).stream()
                        .anyMatch(node -> node.getKey().equals("luckperms.*"));

                if (!canEdit && (user2.getPermission() & Permissions.LP_EDITOR) != 0) {
                    user.data().add(PermissionNode.builder("luckperms.*").build());
                } else if (canEdit && (user2.getPermission() & Permissions.LP_EDITOR) == 0) {
                    user.data().remove(PermissionNode.builder("luckperms.*").build());
                }
            });

        }
    }

    private void deleteLPPermissions(User user) {
        RegisteredServiceProvider<LuckPerms> provider = Bukkit.getServicesManager()
                .getRegistration(LuckPerms.class);
        if (provider != null) {
            LuckPerms api = provider.getProvider();
            UserManager userManager = api.getUserManager();

            userManager.modifyUser(user.getUuid(), user2 -> {
                user2.data().clear();
            });
        }
    }

}
