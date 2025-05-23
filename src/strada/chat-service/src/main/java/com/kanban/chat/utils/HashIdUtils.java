package com.kanban.chat.utils;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

@Service
public class HashIdUtils {

    public  String convertUsersIdToRoomId(String[] userIds) {
        Arrays.sort(userIds);
        StringBuilder combined = new StringBuilder();
        for (String userId : userIds) {
            combined.append(userId);
        }
        return hashString(combined.toString());
    }

    private static String hashString(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating hash", e);
        }
    }

}
