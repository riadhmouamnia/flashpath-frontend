type Path = {
  id: number;
  name: string;
  userId: string;
  createdAt: Date | null;
};

type Page = {
  id: number;
  createdAt: Date | null;
  pathId: number;
  url: string;
  domain: string;
  timeOnPage: string | null;
  isBookmarked: boolean | null;
};

type ClickEvent = {
  tagName: string;
  clientX: number;
  clientY: number;
  textContent: string | null;
  attributes: {
    [key: string]: string;
  };
  timestamp: number;
};

type MediaEventType =
  | "PLAY"
  | "PAUSE"
  | "MUTE"
  | "UNMUTE"
  | "VOLUMECHANGE"
  | "FULLSCREEN"
  | "EXITFULLSCREEN"
  | "SEEK";

type MediaEvent = {
  event: MediaEventType;
  currentTime: number;
  timestamp: number;
};

type ScrollEvent = {
  scrollY: number;
  scrollX: number;
  timestamp: number;
};

type InputKeyEvent = {
  inputValue: string;
  inputType: string;
  inputName: string;
  placeholder: string;
  timestamp: number;
};

type KeyPressEvent = {
  key: string;
  timestamp: number;
};

type SelectEvent = {
  highlightedText: string;
  timestamp: number;
};

type Event = {
  type:
    | "CLICK_EVENT"
    | "KEY_EVENT"
    | "SCROLL_EVENT"
    | "MEDIA_EVENT"
    | "SELECT_EVENT";
  event: ClickEvent | KeyEvent | ScrollEvent | MediaEvent | SelectEvent;
};

type Interaction = {
  id: number;
  createdAt: Date | null;
  pageId: number;
  event: Event;
  type: Event["type"];
  timestamp: string;
};

interface LinkPreviewResponse {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface PathWithPages {
  pages: {
    url: string;
    domain: string;
  }[];
  id: number;
  createdAt: Date | null;
  name: string;
  userId: string;
}

type Note = {
  id: number;
  body: string;
  startTime: Date | null;
  endTime: Date | null;
  tags: string[];
  color: string | null;
  favorite: boolean;
  hidden: boolean;
  sort: number | null;
  createdAt: Date;
};

// Define the type for Pages
type Page = {
  id: number;
  url: string;
  domain: string;
  timeOnPage: number | null;
  isBookmarked: boolean | null;
  createdAt: Date;
  notes: Note[]; // Array of notes associated with this page
};

// Define the type for Paths
type PathWithDetails = {
  id: number;
  name: string;
  createdAt: Date | null;
  userId: string;
  pages: Page[]; // Array of pages associated with this path
  numberOfPages: number; // Total number of pages
  numberOfNotes: number; // Total number of notes across all pages
};

interface NoteWithPage extends Note {
  pageUrl: string;
}
