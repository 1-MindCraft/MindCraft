package com.mindcraft.backend.coverletter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Entity                                 // JPA 엔티티임을 나타내는 애노테이션
@NoArgsConstructor                      // 매개변수가 없는 기본 생성자를 자동으로 생성함
@AllArgsConstructor                     // 모든 필드를 매개변수로 받는 생성자를 자동으로 생성
@Getter                                 // 모든 필드의 Getter 메서드를 자동으로 생성
@Setter                                 // 모든 필드의 Setter 메서드를 자동으로 생성
@ToString(exclude = "coverLetter")
@Table(name = "coverletter_section")    // 엔티티와 매핑할 테이블 이름을 지정
@DynamicUpdate                          // 엔티티 수정 시 변경된 컬럼만 UPDATE SQL에 포함됨
public class CoverLetterSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 여러 개의 항목들이 하나에 속하게 함
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coverletter_id", nullable = false) // NOT NULL
    private CoverLetter coverLetter;

    private String question;
    private String answer;

    /*
        columnDefinition에 대해서

        columnDefinition은 테이블을 자동 생성 / 수정할 때, 이 컬럼의 실제 DB 타입을 추측하지 않고
        적힌 타입 그대로 사용하도록 강제하는 옵션이다.

        이걸 왜 넣었는지에 대해서 : DBeaver 파일에 있는 coverletter_Section 파일을 보면
        answer 옆에 source_node 라는 부분이 있다

        source_node 는 자바에서 String 타입이고
        만약 columnDefinition 을 사용하지 않는다면 Hibernate는 String 필드를 보고
        기본값인 varchar(255) 컬럼으로 만들어버릴 것이다.

        DBeaver의 coverletter_section 파일의 컬럼은 source_node [ jsonb ] 를 가지고 있으므로
        columnDefinition = "jsonb" 를 사용하는 것이 좋다고 생각한다.
     */
    @Column(name = "source_node", columnDefinition = "jsonb")
    private String sourceNode;

    @Column(name = "writing_style")
    private String writingStyle;

    @Column(name = "max_chars")
    private Integer maxChars;

    @Column(name = "allow_creativity")
    private Boolean allowCreativity;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }
}
