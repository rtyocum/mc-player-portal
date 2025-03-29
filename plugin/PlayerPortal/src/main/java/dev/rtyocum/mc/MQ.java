package dev.rtyocum.mc;

import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

public class MQ {
    private static final ObjectMapper mapper = new ObjectMapper();
    private Channel channel;
    private static MQ instance;

    private MQ(String uri) throws KeyManagementException, NoSuchAlgorithmException, URISyntaxException {
        // Start the MQ service
        ConnectionFactory factory = new ConnectionFactory();
        factory.setUri(uri);
        try {
            Connection connection = factory.newConnection();
            channel = connection.createChannel();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static MQ init(String uri) throws KeyManagementException, NoSuchAlgorithmException, URISyntaxException {
        if (instance == null) {
            instance = new MQ(uri);
        }
        return instance;
    }

    private static MQ getInstance() {
        return instance;
    }

    public static void publish(String queue, Object message) {
        MQ instance = getInstance();
        try {
            String json = mapper.writeValueAsString(message);
            instance.channel.queueDeclare(queue, true, false, false, null);
            instance.channel.basicPublish("", queue, null, json.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void close() {
        MQ instance = getInstance();
        try {
            instance.channel.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void consume(String queue, DeliverCallback handler) {
        MQ instance = getInstance();
        try {
            instance.channel.queueDeclare(queue, true, false, false, null);
            instance.channel.basicConsume(queue, false, handler, consumerTag -> {
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void ack(long deliveryTag) {
        MQ instance = getInstance();
        try {
            instance.channel.basicAck(deliveryTag, false);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
