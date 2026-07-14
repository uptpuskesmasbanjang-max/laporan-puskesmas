'use client';

import ProgramTabBase from './ProgramTabBase';

export default function CapaianTab() {
  return (
    <ProgramTabBase
      title="Capaian"
      endpoint="/api/capaian"
      nilaiKey="nilai_capaian"
      editLabel="Capaian"
    />
  );
}
