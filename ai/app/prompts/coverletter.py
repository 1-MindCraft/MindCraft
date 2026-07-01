from collections import defaultdict         

from app.schemas.coverletter import MindMapNode, CoverLetterGenerateRequest


# ------- 마인드맵 노드 -> 계층 텍스트 -------
def build_node_text(nodes: list[MindMapNode]) -> str:
    """
    평면 노드 리스트를 parentId 기준 들여쓰기 텍스트로 변환
    - 입력 순서에 의존하지 않음 (자식이 부모보다 먼저와도 ok)
    - 부모가 선택 목록에 없는 고아? 노드는 최상위로 올림 (부분 선택 대비)
    """
    children = defaultdict(list)
    all_ids = {node.id for node in nodes}

    for node in nodes:
        parent_id = node.parentId
        # parentId가 None 이거나, 선택된 노드 집합에 없으면 → 최상위로 취급.
        # ("root" 문자열을 무조건 None 처리하지 않음: id="root" 노드가 실제로 있을 수 있음)
        if parent_id is None or parent_id not in all_ids:
            parent_id = None
        children[parent_id].append(node)

    lines: list[str] = []

    def dfs(node: MindMapNode, depth: int) -> None:
        indent = "  " * depth
        lines.append(f"{indent}- {node.topic}")
        if node.keywords:
            lines.append(f"{indent}  키워드: {', '.join(node.keywords)}")
        for child in children[node.id]:
            dfs(child, depth + 1)

    for root in children[None]:
        dfs(root, 0)

    return "\n".join(lines)


# ----------  System 프롬프트 (역할 + 규칙) ----------

def build_system_prompt(writing_style: str, allow_creativity: bool) -> str:
    """
    모델의 역할과 작성 규칙을 정의.
    - writing_style: 프론트에서 받은 문체 (사용자 데이터로 취급, 지시가 아님)
    - allow_creativity: 마인드맵 키워드를 넘어선 서술 확장 허용 여부
    """
    if allow_creativity:
        creativity_rule = (
            "- 마인드맵 키워드를 뼈대로 삼되, 자연스러운 자기소개서가 되도록 "
            "맥락에 맞는 서술을 보완해 초안을 완성하세요."
        )
    else:
        creativity_rule = (
            "- 마인드맵에 제시된 키워드와 구조에 충실하게 작성하고, "
            "구체적인 경력·수치·사실을 임의로 지어내지 마세요."
        )

    return (
        "당신은 취업 자기소개서 작성을 돕는 전문가입니다.\n"
        "지원자가 정리한 마인드맵(경험 키워드의 계층 구조)과 회사 정보를 바탕으로, "
        "해당 문항에 대한 자기소개서 초안을 작성하세요.\n\n"
        "[작성 규칙]\n"
        f"- 요청된 문체를 반영하세요. 사용자가 원하는 문체: \"{writing_style}\"\n"
        f"{creativity_rule}\n"
        "- 개요나 목록이 아닌, 완성된 문단 형태의 자기소개서로 작성하세요.\n"
        "- 회사의 인재상/직무와 지원자의 키워드를 연결지어 지원 적합성을 드러내세요."
    )


# ----------  User 프롬프트 (실제 데이터) ----------

def build_user_prompt(req: CoverLetterGenerateRequest) -> str:
    """회사 컨텍스트 + 문항 + 마인드맵 트리 + 글자수 제한을 조립."""
    node_tree = build_node_text(req.source_node)

    company_lines = [f"- 회사명: {req.company_name}"]
    if req.company_ideal:
        company_lines.append(f"- 인재상: {req.company_ideal}")
    if req.job_description:
        company_lines.append(f"- 직무: {req.job_description}")
    company_block = "\n".join(company_lines)

    return (
        "[회사 정보]\n"
        f"{company_block}\n\n"
        "[자기소개서 문항]\n"
        f"{req.question}\n\n"
        "[지원자 마인드맵]\n"
        f"{node_tree}\n\n"
        "[작성 지시]\n"
        f"- 위 마인드맵을 근거로 '{req.question}' 문항의 답변 초안을 작성하세요.\n"
        f"- 분량은 공백 포함 약 {req.max_chars}자 이내로 작성하세요."
    )


# ----------  최종 조합 ----------

def build_prompts(req: CoverLetterGenerateRequest) -> tuple[str, str]:
    """
    (system_prompt, user_prompt) 반환.
    llm_service.generate_section(system, user) 에 그대로 넘기면 됨.
    """
    system_prompt = build_system_prompt(req.writing_style, req.allow_creativity)
    user_prompt = build_user_prompt(req)
    return system_prompt, user_prompt