import type { GameSettings as GameSettingsType } from "../../types";

interface GameSettingsProps {
  settings: GameSettingsType;
  isHost: boolean;
  onSettingsChange?: (settings: Partial<GameSettingsType>) => void;
}

const GameSettings = ({ settings, isHost, onSettingsChange }: GameSettingsProps) => {
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dayDuration = parseInt(e.target.value);
    onSettingsChange?.({ dayDuration });
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const difficulty = e.target.value as "easy" | "medium" | "hard";
    onSettingsChange?.({ difficulty });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wordCategory = e.target.value;
    onSettingsChange?.({ wordCategory });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Game Settings</h3>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Day Duration</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={settings.dayDuration}
          onChange={handleDurationChange}
          disabled={!isHost}
        >
          <option value={120}>2 minutes</option>
          <option value={180}>3 minutes</option>
          <option value={240}>4 minutes</option>
          <option value={300}>5 minutes</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Word Difficulty</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={settings.difficulty}
          onChange={handleDifficultyChange}
          disabled={!isHost}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Word Category</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={settings.wordCategory}
          onChange={handleCategoryChange}
          disabled={!isHost}
        >
          <option value="general">General</option>
          <option value="animals">Animals</option>
          <option value="food">Food</option>
          <option value="places">Places</option>
          <option value="occupations">Occupations</option>
          <option value="sports">Sports</option>
          <option value="nature">Nature</option>
          <option value="household">Household</option>
          <option value="concepts">Concepts</option>
          <option value="science">Science</option>
          <option value="mythology">Mythology</option>
          <option value="technology">Technology</option>
          <option value="history">History</option>
        </select>
      </div>

      <div className="divider">Tokens</div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between p-2 bg-success/20 rounded">
          <span>Yes</span>
          <span className="font-bold">{settings.tokenCounts.yes}</span>
        </div>
        <div className="flex justify-between p-2 bg-error/20 rounded">
          <span>No</span>
          <span className="font-bold">{settings.tokenCounts.no}</span>
        </div>
        <div className="flex justify-between p-2 bg-warning/20 rounded">
          <span>Maybe</span>
          <span className="font-bold">{settings.tokenCounts.maybe}</span>
        </div>
        <div className="flex justify-between p-2 bg-info/20 rounded">
          <span>So Close</span>
          <span className="font-bold">{settings.tokenCounts.soClose}</span>
        </div>
      </div>
    </div>
  );
};

export default GameSettings;
