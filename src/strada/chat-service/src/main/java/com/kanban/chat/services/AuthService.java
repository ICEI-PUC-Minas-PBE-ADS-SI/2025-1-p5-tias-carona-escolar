package com.kanban.chat.services;

import com.kanban.chat.repositories.ChatRepository;
import com.kanban.chat.utils.HashIdUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service("authService")
public class AuthService {

  private final ChatRepository chatRepository;
  private final HashIdUtils hashIdUtils;

  public AuthService(ChatRepository chatRepository, HashIdUtils hashIdUtils) {
    this.chatRepository = chatRepository;
    this.hashIdUtils = hashIdUtils;
  }

  public boolean isMemberOfChat(String nickName, String chatRoomId) {
    String roomId = hashIdUtils.convertUsersIdToRoomId(chatRoomId.split("_"));
    boolean exists = chatRepository.existsById(roomId);
    if (!exists) {
      log.warn("Chat room with id {} does not exist", roomId);
      return true;
    }
    log.info("Checking if user is member of chat {} {}", nickName, chatRoomId);
    return chatRepository.checkIfUserIsMember(roomId, nickName);
  }
}
