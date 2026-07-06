package com.mindcraft.backend.user.mapper;

import com.mindcraft.backend.user.dto.UserJoinDto;
import com.mindcraft.backend.user.dto.UserResponseDto;
import com.mindcraft.backend.user.dto.UserUpdateDto;
import com.mindcraft.backend.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User userJoinDtoToUser(UserJoinDto userJoinDto);

    User userUpdateDtoToUser(UserUpdateDto userUpdateDto);

    UserResponseDto userToUserResponseDto(User user);
}
