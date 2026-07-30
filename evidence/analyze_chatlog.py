#!/usr/bin/env python3
"""Reproduce the field-level VLearn findings used in spec.md."""

import csv
import json
import statistics
from collections import Counter
from pathlib import Path


DATA = Path(__file__).parents[1] / "data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv"
EXAMPLE_TURNS = ("T0720", "T0923", "T1015", "T0315", "T0109")
TEACHING_MOVES = {"review_concept", "give_direct_answer", "give_example", "give_hint"}


def percent(part: int, whole: int) -> str:
    return f"{part / whole:.1%}"


def main() -> None:
    with DATA.open(encoding="utf-8-sig", newline="") as source:
        rows = list(csv.DictReader(source))

    tutors = [row for row in rows if row["role"] == "tutor"]
    students = [row for row in rows if row["role"] == "student"]
    by_turn = {row["turn_id"]: row for row in students}
    teaching = [row for row in tutors if row["move_used"] in TEACHING_MOVES]
    latencies = [int(row["avg_latency_ms"]) for row in tutors]

    checks = sum(row["asked_check_question"] == "True" for row in tutors)
    teaching_without_check = sum(row["asked_check_question"] == "False" for row in teaching)
    no_citation = sum(not json.loads(row["citations"] or "[]") for row in tutors)
    empty_misconceptions = sum(not json.loads(row["misconceptions"] or "[]") for row in tutors)
    empty_follow_ups = sum(not json.loads(row["follow_ups"] or "[]") for row in tutors)
    slow = sum(latency >= 5000 for latency in latencies)

    print("# VLearn chatlog mining — reproducible output\n")
    print(f"- Scope: {len(tutors):,} turns, {len({r['user_id'] for r in rows})} users, "
          f"{len({r['conversation_id'] for r in rows})} conversations.")
    print(f"- Understanding check used: {checks}/{len(tutors)} ({percent(checks, len(tutors))}).")
    print(f"- Teaching answers without a check: {teaching_without_check}/{len(teaching)} "
          f"({percent(teaching_without_check, len(teaching))}).")
    print(f"- Empty misconception field: {empty_misconceptions}/{len(tutors)} "
          f"({percent(empty_misconceptions, len(tutors))}).")
    print(f"- Empty follow-up field: {empty_follow_ups}/{len(tutors)} "
          f"({percent(empty_follow_ups, len(tutors))}).")
    print(f"- No citation: {no_citation}/{len(tutors)} ({percent(no_citation, len(tutors))}).")
    print(f"- Latency >= 5 seconds: {slow}/{len(tutors)} ({percent(slow, len(tutors))}); "
          f"median {statistics.median(latencies):,.0f} ms; max {max(latencies):,} ms.")
    print(f"- Median message length: student {statistics.median(len(r['content']) for r in students):.0f} "
          f"characters; tutor {statistics.median(len(r['content']) for r in tutors):.0f} characters.")
    print(f"- Tutor moves: {dict(Counter(row['move_used'] for row in tutors))}.\n")
    print("## Five traceable examples\n")
    for turn_id in EXAMPLE_TURNS:
        row = by_turn[turn_id]
        excerpt = row["content"].replace("\n", " ")
        print(f"- `{turn_id}`: “{excerpt}”")


if __name__ == "__main__":
    main()
