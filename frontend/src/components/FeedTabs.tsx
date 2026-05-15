interface Props {
  isAuthed: boolean;
  activeTab: 'your' | 'global' | 'tag';
  tagName?: string;
  onSelect: (tab: 'your' | 'global') => void;
}

export function FeedTabs({ isAuthed, activeTab, tagName, onSelect }: Props) {
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {isAuthed && (
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === 'your' ? 'active' : ''}`}
              onClick={() => onSelect('your')}
            >
              Your Feed
            </button>
          </li>
        )}
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'global' ? 'active' : ''}`}
            onClick={() => onSelect('global')}
          >
            Global Feed
          </button>
        </li>
        {activeTab === 'tag' && tagName && (
          <li className="nav-item">
            <span className="nav-link active">
              <i className="ion-pound" /> {tagName}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
