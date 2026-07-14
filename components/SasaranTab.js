'use client';

import ProgramTabBase from './ProgramTabBase';

export default function SasaranTab() {
  return (
    <ProgramTabBase
      title="Sasaran / Target"
      endpoint="/api/sasaran"
      nilaiKey="nilai_target"
      editLabel="Sasaran"
    />
  );
}
