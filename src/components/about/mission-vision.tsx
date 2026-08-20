import Image from "next/image";
import { Target, Eye } from "lucide-react";

export function MissionVision() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src="/about/strategy-session.jpg"
            alt="iLab Growth strategy session"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3
                className="text-lg font-semibold text-neutral-900"
                style={{ fontFamily: "var(--font-ubuntu)" }}
              >
                Our Mission
              </h3>
              <p className="mt-2 text-neutral-600">
                To equip every African entrepreneur and SME owner with the
                knowledge, tools, and support they need to build sustainable,
                profitable businesses — regardless of their starting point.
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-t border-neutral-100 pt-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3
                className="text-lg font-semibold text-neutral-900"
                style={{ fontFamily: "var(--font-ubuntu)" }}
              >
                Our Vision
              </h3>
              <p className="mt-2 text-neutral-600">
                A continent where every ambitious entrepreneur has access to
                the same quality of business education and tools that their
                counterparts in any developed market enjoy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}