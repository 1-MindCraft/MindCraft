// 추가된 부분: 이 파일 전체가 새로 추가된 파일입니다
// 이유: 자소서를 PDF/DOCX 바이트 배열로 변환하는 역할을, 기존 CoverLetterService(조회/생성/수정)와
// 책임을 분리하기 위해 별도 인터페이스로 뺌 (단일 책임 원칙 — export 로직이 커질 걸 대비)
package com.mindcraft.backend.coverletter.export.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterDto;

public interface CoverLetterExportService {

    // 자소서(제목 + 문항 목록)를 PDF 파일 바이트로 변환
    byte[] toPdf(CoverLetterDto coverLetterDto);

    // 자소서(제목 + 문항 목록)를 DOCX 파일 바이트로 변환
    byte[] toDocx(CoverLetterDto coverLetterDto);
}