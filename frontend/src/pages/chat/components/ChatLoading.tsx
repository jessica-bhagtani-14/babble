const ChatLoading = () => {
  return (
    <div>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            height: 45,
            background: '#e5e7eb',
            borderRadius: 8,
            marginBottom: 8,
            animation: 'pulse 1.5s infinite',
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChatLoading;
