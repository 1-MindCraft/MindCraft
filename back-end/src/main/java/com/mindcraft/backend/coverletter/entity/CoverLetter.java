package com.mindcraft.backend.coverletter.entity;

import com.mindcraft.backend.user.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

// 자기소개서에 대한 Entity
@Entity
@Getter
@NoArgsConstructor
@Table(name = "cover_letter")
public class CoverLetter {

    // 자기소개서 고유 식별자
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 자기소개서 제목
    @Column(nullable = false)
    private String title;

    // 회원 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // 자기소개서 항목과의 관계 설정 ( 자기소개서를 지우면 항목도 다 지워짐 )
    @OneToMany(mappedBy = "coverLetter", cascade = CascadeType.ALL)
    private List<> sections = new ArrayList<>();

    // 자기소개서 생성자
    public CoverLetter(Member member, String title) {
        this.member = member;
        this.title = title;
    }
}
