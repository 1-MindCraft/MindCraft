package com.mindcraft.backend.user.service;

import com.mindcraft.backend.global.exception.MailSendException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;

    // email 문구 설정
    public void sendVerificationCode(String toEmail, String code) {
        String html = """
            <div style="max-width:480px;margin:0 auto;padding:32px;
                        background-color:#f5f6fa;border-radius:8px;
                        font-family:sans-serif;text-align:center;">
                <h2 style="color:#333;">MindCraft 이메일 인증</h2>
                <p style="color:#555;">아래 인증 코드를 5분 이내에 입력해주세요.</p>
                <div style="margin:24px 0;padding:16px;background-color:#ffffff;
                            border-radius:6px;display:inline-block;">
                    <span style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#2d5be3;">
                        %s
                    </span>
                </div>
                <p style="color:#999;font-size:12px;">본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.</p>
            </div>
            """.formatted(code);

        send(toEmail, "[MindCraft] 이메일 인증 코드", html);
    }

    // 비밀번호 재설정
    public void sendTemporaryPassword(String toEmail, String tempPassword) {
        String html = """
            <div style="max-width:480px;margin:0 auto;padding:32px;
                        background-color:#f5f6fa;border-radius:8px;
                        font-family:sans-serif;text-align:center;">
                <h2 style="color:#333;">임시 비밀번호 안내</h2>
                <div style="margin:24px 0;padding:16px;background-color:#ffffff;
                            border-radius:6px;display:inline-block;">
                    <span style="font-size:24px;font-weight:bold;color:#2d5be3;">
                        %s
                    </span>
                </div>
                <p style="color:#555;">로그인 후 마이페이지에서 반드시 비밀번호를 변경해주세요.</p>
            </div>
            """.formatted(tempPassword);

        send(toEmail, "[MindCraft] 임시 비밀번호 안내", html);
    }

    private void send(String toEmail, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new MailSendException("이메일 발송에 실패했습니다.", e);
        }
    }
}
