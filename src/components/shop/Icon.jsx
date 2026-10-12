const paths = {
  pause: 'M9 5v14M15 5v14',
  play: 'm7 4 13 8-13 8V4',
  bag: 'M6 7h12l1 14H5L6 7Zm3 0V5a3 3 0 0 1 6 0v2',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  close: 'm6 6 12 12M6 18 18 6',
  search: 'M21 21l-5-5m2-6a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  menu: 'M4 6h16M4 12h16M4 18h16',
  chevron: 'm6 9 6 6 6-6',
  check: 'm5 12 4 4L19 6',
  heart:
    'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  truck:
    'M1 4h14v12H1V4Zm14 4h4l3 4v4h-7M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  leaf: 'M20 3c0 12-5 17-11 17a7 7 0 0 1 0-14c4 0 8-1 11-3ZM4 22 16 10',
  lock: 'M5 10h14v11H5V10Zm3 0V6a4 4 0 0 1 8 0v4',
};
export default function Icon({ name, size = 22, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
