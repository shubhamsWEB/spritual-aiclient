import Link from 'next/link';

type SourceReferenceProps = {
  chapter: number;
  verse?: number;
  paragraph_id?: number;
};

const SourceReference = ({ chapter, verse, paragraph_id }: SourceReferenceProps) => {
  // Format the display text
  let displayText = '';
  if (chapter && verse) {
    displayText = `Chapter ${chapter}, Verse ${verse}`;
  } else if (chapter) {
    displayText = `Chapter ${chapter}`;
  } else if (paragraph_id !== undefined) {
    displayText = `Paragraph ${paragraph_id}`;
    return <span className="text-gray-600">{displayText}</span>;
  }
  
  // Create the query parameter for PDF navigation
  const queryParam = verse ? `${chapter}.${verse}` : `${chapter}`;
  
  return (
    <Link 
      href={`/pdf?page=${queryParam}`}
      className="text-amber-700 hover:text-amber-500 underline font-medium"
      target="_blank"
    >
      {displayText}
    </Link>
  );
};

export default SourceReference; 