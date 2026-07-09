// 추가된 부분: 이 파일 전체가 새로 추가된 파일입니다
// 이유: CoverLetterExportService의 실제 구현체(PDF는 OpenPDF, DOCX는 Apache POI 사용)가 필요해서 추가
package com.mindcraft.backend.coverletter.export.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterDto;
import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
@Slf4j
public class CoverLetterExportServiceImpl implements CoverLetterExportService {

    // 추가된 부분: 한글 출력을 위한 폰트 리소스 경로
    // 이유: OpenPDF 기본 내장 폰트는 한글을 지원하지 않아서, 직접 폰트 파일을 embed 해야 함.
    // src/main/resources/fonts/ 밑에 실제 ttf 파일(예: Noto Sans KR)을 넣어야 동작함 — 아직 파일이
    // 없다면 반드시 추가해야 함 (라이선스가 자유로운 한글 폰트를 다운로드해서 넣어주세요)
    private static final String FONT_PATH = "fonts/NotoSansKR-Regular.ttf";

    @Override
    public byte[] toPdf(CoverLetterDto dto) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = createKoreanFont(20, Font.BOLD);
            Font questionFont = createKoreanFont(13, Font.BOLD);
            Font answerFont = createKoreanFont(11, Font.NORMAL);

            document.add(new Paragraph(nullToDefault(dto.getTitle(), "자기소개서"), titleFont));
            document.add(Chunk.NEWLINE);

            List<CoverLetterSectionDto> sections = dto.getSections();
            if (sections != null) {
                for (CoverLetterSectionDto section : sections) {
                    document.add(new Paragraph(nullToDefault(section.getQuestion(), "제목 없음"), questionFont));
                    document.add(new Paragraph(nullToDefault(section.getAnswer(), ""), answerFont));
                    document.add(Chunk.NEWLINE);
                }
            }

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            // 추가된 부분: 실패 원인을 로그로 남김
            // 이유: 파일 생성은 브라우저 다운로드까지 이어지는 흐름이라, 실패했을 때 원인을
            // 서버 로그에서 바로 확인할 수 있어야 디버깅이 쉬움
            log.error("PDF 생성 실패", e);
            throw new RuntimeException("PDF 생성 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public byte[] toDocx(CoverLetterDto dto) {
        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            XWPFParagraph titlePara = document.createParagraph();
            XWPFRun titleRun = titlePara.createRun();
            titleRun.setText(nullToDefault(dto.getTitle(), "자기소개서"));
            titleRun.setBold(true);
            titleRun.setFontSize(20);
            // 추가된 부분: 폰트명을 "맑은 고딕"으로 지정
            // 이유: DOCX(Word)는 PDF와 달리 폰트를 파일 안에 심지 않고 "이 폰트를 써라"라는
            // 이름표만 저장함 — 읽는 사람 컴퓨터에 그 폰트가 설치되어 있으면 그대로 보여짐.
            // 한글 문서니까 대부분의 윈도우에 기본 설치된 "맑은 고딕"으로 지정함
            titleRun.setFontFamily("맑은 고딕");

            List<CoverLetterSectionDto> sections = dto.getSections();
            if (sections != null) {
                for (CoverLetterSectionDto section : sections) {
                    XWPFParagraph qPara = document.createParagraph();
                    XWPFRun qRun = qPara.createRun();
                    qRun.setText(nullToDefault(section.getQuestion(), "제목 없음"));
                    qRun.setBold(true);
                    qRun.setFontSize(13);
                    qRun.setFontFamily("맑은 고딕");

                    XWPFParagraph aPara = document.createParagraph();
                    XWPFRun aRun = aPara.createRun();
                    aRun.setText(nullToDefault(section.getAnswer(), ""));
                    aRun.setFontSize(11);
                    aRun.setFontFamily("맑은 고딕");
                }
            }

            document.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            log.error("DOCX 생성 실패", e);
            throw new RuntimeException("DOCX 생성 중 오류가 발생했습니다.", e);
        }
    }

    // 추가된 부분: 폰트 파일을 클래스패스(리소스)에서 읽어서 embed된 Font 객체로 만들어주는 헬퍼
    // 이유: Spring Boot 앱은 jar로 패키징되기 때문에, 파일 경로로 직접 읽으면 배포 후 동작 안 할 수
    // 있음. 그래서 클래스패스 리소스를 바이트 배열로 읽어들이는 방식(byte[] 오버로드)을 씀
    private Font createKoreanFont(float size, int style) throws IOException, DocumentException {
        ClassPathResource resource = new ClassPathResource(FONT_PATH);
        try (InputStream is = resource.getInputStream()) {
            byte[] fontBytes = is.readAllBytes();
            BaseFont baseFont = BaseFont.createFont(
                    FONT_PATH, BaseFont.IDENTITY_H, BaseFont.EMBEDDED,
                    true, fontBytes, null
            );
            return new Font(baseFont, size, style);
        }
    }

    private String nullToDefault(String value, String fallback) {
        return (value == null || value.isBlank()) ? fallback : value;
    }
}