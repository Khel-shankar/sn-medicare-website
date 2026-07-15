"use client";

import { useState } from "react";
import type { TeamMember } from "@/data/team";

export default function TeamAvatar({
  member,
  size = "md",
}: {
  member: TeamMember;
  size?: "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const dim = size === "lg" ? "w-40 h-40 sm:w-48 sm:h-48" : "w-28 h-28";

  return (
    <div
      className={`relative ${dim} rounded-2xl overflow-hidden bg-gradient-to-br from-kivo-cyan/30 to-surface-elevated border border-border mx-auto`}
    >
      {!failed && member.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.image}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-kivo-cyan">
          {member.initials}
        </div>
      )}
    </div>
  );
}
