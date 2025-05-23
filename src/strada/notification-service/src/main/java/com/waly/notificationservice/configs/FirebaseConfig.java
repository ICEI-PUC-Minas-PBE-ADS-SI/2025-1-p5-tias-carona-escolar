package com.waly.notificationservice.configs;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Slf4j
@Configuration
public class FirebaseConfig {

  @Value("${app.firebase-configuration}")
  private String firebaseConfigJsonPath;

  @PostConstruct
  public void initialize() {
    try {
      log.info("Firebase application initializing");
      ByteArrayInputStream serviceAccount = getInputStream();
      FirebaseOptions options = new FirebaseOptions.Builder()
              .setCredentials(GoogleCredentials.fromStream(serviceAccount)).build();
      if (FirebaseApp.getApps().isEmpty()) {
        FirebaseApp.initializeApp(options);
        log.info("Firebase application initialized");
      }
    } catch (IllegalArgumentException | IOException e) {
      log.error("Firebase application Error on initialize");
      log.error(e.getMessage());
    }
  }

  private ByteArrayInputStream getInputStream() throws IOException {
    if (firebaseConfigJsonPath.startsWith("file:")) {
      String filePath = firebaseConfigJsonPath.substring("file:".length());
      try {
        byte[] bytes = Files.readAllBytes(Paths.get(filePath));
        return new ByteArrayInputStream(bytes);
      } catch (IOException e) {
        throw new IOException("Failed to read file: " + filePath, e);
      }
    } else {
      return new ByteArrayInputStream(firebaseConfigJsonPath.getBytes(StandardCharsets.UTF_8));
    }
  }
}
