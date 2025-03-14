package dev.rtyocum.mc;

import java.util.Arrays;
import java.util.UUID;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.RegisteredServiceProvider;

import net.luckperms.api.LuckPerms;
import net.luckperms.api.model.user.UserManager;

public class CommandBan implements CommandExecutor {

    // This method is called, when somebody uses our command
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length < 2) {
            sender.sendMessage(ChatColor.RED + "Usage: /ban <player> <reason>");
            return true;
        }

        Player target = Bukkit.getPlayerExact(args[0]);
        if (target == null) {
            sender.sendMessage(ChatColor.RED + "Player must be online to use /ban. Use the portal for offline bans.");
            return true;
        }

        String reason = String.join(" ", Arrays.copyOfRange(args, 1, args.length));

        // Your MQ message logic here
        UUID uuid = target.getUniqueId();
        String username = target.getName();

        BanMessage banMessage = new BanMessage(uuid.toString().replace("-", ""));
        RegisteredServiceProvider<LuckPerms> provider = Bukkit.getServicesManager()
                .getRegistration(LuckPerms.class);
        if (provider != null) {
            LuckPerms api = provider.getProvider();
            UserManager userManager = api.getUserManager();

            userManager.modifyUser(uuid, user -> {
                user.data().clear();
            });
        }

        MQ.publish("user.ban", banMessage);

        target.kickPlayer(ChatColor.RED + "You have been banned: " + reason);

        sender.sendMessage(ChatColor.GREEN + "Player " + username + " has been banned.");

        return true;
    }

}
