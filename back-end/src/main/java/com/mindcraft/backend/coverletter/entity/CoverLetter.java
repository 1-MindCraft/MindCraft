package com.mindcraft.backend.coverletter.entity;

import com.mindcraft.backend.mindmap.entity.MindMap;
import com.mindcraft.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Entity                             // JPA 엔티티임을 나타내는 애노테이션
@NoArgsConstructor                  // 매개변수가 없는 기본 생성자를 자동으로 생성함
@AllArgsConstructor                 // 모든 필드를 매개변수로 받는 생성자를 자동으로 생성
@Getter                             // 모든 필드의 Getter 메서드를 자동으로 생성
@Setter                             // 모든 필드의 Setter 메서드를 자동으로 생성
@ToString(exclude = "user")
@Table(name = "coverletter")        // 엔티티와 매핑할 테이블 이름을 지정
@DynamicUpdate                      // 엔티티 수정 시 변경된 컬럼만 UPDATE SQL에 포함됨
public class CoverLetter {

    @Id // 엔티티의 기본 키 (Primary key) 를 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // userid에 FK (외래키) 연결하기
    // mindmap.java와 똑같은 방식
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

//    private Long mindmapId; // 나중에 mindmap과 연관 관계 설정 필요 ( DBeaver )

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mindmap_id", nullable = false)
    private MindMap mindMap;

    private String title;
    private String companyName;
    private String companyIdeal;
    private String jobDescription;

    // regDate 필드를 created_at 컬럼과 매핑
    // updatable = false : 생성한 후에 수정되지 않도록 설정
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // regDate 필드를 updated_at 컬럼과 매핑
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // PrePersist : 엔티티가 처음 저장되기 직전에 실행
    @PrePersist
    public void prePersist() {
        if (title == null || title.isBlank()) { // 만약 제목이 null이거나 비어있을 경우
            title = "자기소개서 초안"; // 비어있으면 "자기소개서 초안" 을 집어넣음
        }
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }
}
