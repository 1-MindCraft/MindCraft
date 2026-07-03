package com.mindcraft.backend.user.repository;

import com.mindcraft.backend.user.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MemberRepository extends JpaRepository<Member, Long> {
}
