type Props = {
  monthlyTotal?: number;
};

function SummarySection({ monthlyTotal = 0 }: Props) {
  
  return (
    <section style={{ marginBottom: 24 }}>
      <h2>이번 달 총 소비</h2>

      <p style={{ fontSize: 24, fontWeight: 600 }}>
        {monthlyTotal.toLocaleString()}원
      </p>
    </section>
  );
}

export default SummarySection;