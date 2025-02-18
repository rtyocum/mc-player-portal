package dev.rtyocum.mc;

import org.bukkit.plugin.java.JavaPlugin;

/**
 * Hello world!
 */
public class Main extends JavaPlugin {
    @Override
    public void onEnable() {
        getServer().getPluginManager().registerEvents(new EventListener(), this);
    }

    @Override
    public void onDisable() {
    }
}
