import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../i18n';

export interface ReelData {
  altText?: string | null;
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  profileName: string;
  profilePic: string | null;
  instagramUrl: string;
  descriptions: Record<string, string>;
  likes: number;
  comments: number;
  order: number;
}

interface ReelCardProps {
  reel: ReelData;
  isActive?: boolean;
  onActivate?: () => void;
  currentLang?: Language;
}

export function ReelCard({ reel, isActive = false, onActivate, currentLang = 'tr' }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Autoplay or pause on active state change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!isActive && onActivate) {
      onActivate();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = reel.instagramUrl;
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.profileName,
          text: reel.descriptions[currentLang] || reel.descriptions.tr,
          url,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Instagram bağlantısı panoya kopyalandı!');
    }
  };

  const followTextMap: Record<Language, string> = {
    tr: 'Takip Et',
    en: 'Follow',
    ar: 'متابعة',
    de: 'Folgen',
  };

  const soundTextMap: Record<Language, { on: string; off: string }> = {
    tr: { on: 'Sesi Kapat', off: 'Sesi Aç' },
    en: { on: 'Mute', off: 'Unmute' },
    ar: { on: 'كتم', off: 'تشغيل الصوت' },
    de: { on: 'Stumm', off: 'Ton an' },
  };

  const audioNoteMap: Record<Language, string> = {
    tr: 'Orijinal Ses',
    en: 'Original Audio',
    ar: 'صوت أصلي',
    de: 'Originalton',
  };

  const currentDesc = reel.descriptions[currentLang] || reel.descriptions.tr;
  const followLabel = followTextMap[currentLang] || followTextMap.tr;
  const soundLabel = isMuted
    ? (soundTextMap[currentLang] || soundTextMap.tr).off
    : (soundTextMap[currentLang] || soundTextMap.tr).on;
  const audioLabel = audioNoteMap[currentLang] || audioNoteMap.tr;

  return (
    <div
      className={`reel-card ${isActive ? 'reel-card--active' : 'reel-card--inactive'}`}
      onClick={!isActive ? onActivate : undefined}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbnailUrl || undefined}
        className="reel-video"
        onClick={togglePlay}
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        aria-label={reel.altText || (reel.descriptions && reel.descriptions[currentLang]) || "Elif Ay Saç Ekimi Reels Videosu"}
        title={reel.altText || (reel.descriptions && reel.descriptions[currentLang]) || "Elif Ay Saç Ekimi Reels Videosu"}
      />

      {/* Play/Pause icon indicator when paused */}
      {!isPlaying && (
        <div className="reel-play-icon" onClick={togglePlay}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M6 4L20 12L6 20V4Z" />
          </svg>
        </div>
      )}

      {/* Top Header Overlay */}
      <div
        className="reel-overlay-top"
        style={{ opacity: isActive ? 1 : 0 }}
      >
        <span className="reel-reels-label">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
          Reels
        </span>

        {/* Mute / Unmute pill button */}
        <button
          type="button"
          className="reel-mute-pill"
          onClick={toggleMute}
          aria-label={soundLabel}
        >
          {isMuted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
          <span>{soundLabel}</span>
        </button>
      </div>

      {/* Bottom Profile and Caption Overlay */}
      <div
        className="reel-overlay-bottom"
        style={{ opacity: isActive ? 1 : 0 }}
      >
        <div className="reel-profile-row">
          <div className="reel-avatar">
            {reel.profilePic ? (
              <img src={reel.profilePic} alt={reel.profileName} loading="lazy" />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#333' }} />
            )}
          </div>
          <span className="reel-profile-name">{reel.profileName}</span>
          <a
            href={reel.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reel-follow-btn"
          >
            {followLabel}
          </a>
        </div>

        {currentDesc && (
          <p className="reel-desc" title={currentDesc}>
            {currentDesc}
          </p>
        )}

        <div className="reel-audio-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span>{reel.profileName} • {audioLabel}</span>
        </div>
      </div>

      {/* Right Action Icons (Like, Comment, Share, More, Spinning Disc) */}
      <div
        className="reel-actions"
        style={{ opacity: isActive ? 1 : 0 }}
      >
        {/* Heart / Like button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`reel-action-btn ${isLiked ? 'is-liked' : ''}`}
          aria-label="Beğen"
        >
          <svg
            className="reel-action-icon"
            viewBox="0 0 24 24"
            fill={isLiked ? '#ff3040' : 'none'}
            stroke={isLiked ? '#ff3040' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span className="reel-action-count">{reel.likes + (isLiked ? 1 : 0)}</span>
        </button>

        {/* Comment icon button */}
        <a
          href={reel.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="reel-action-btn"
          aria-label="Yorumlar"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            className="reel-action-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: 'scaleX(-1)' }}
            aria-hidden="true"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
          <span className="reel-action-count">{reel.comments}</span>
        </a>

        {/* Share button */}
        <button
          type="button"
          onClick={handleShare}
          className="reel-action-btn"
          aria-label="Paylaş"
        >
          <svg
            className="reel-action-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: 'rotate(-12deg)' }}
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>

        {/* More icon */}
        <a
          href={reel.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="reel-action-btn"
          aria-label="Daha Fazla"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            className="reel-action-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </a>

        {/* Spinning Vinyl Audio Disc */}
        <div className={`reel-vinyl-disc ${isPlaying ? 'is-spinning' : ''}`}>
          {reel.profilePic ? (
            <img src={reel.profilePic} alt={reel.profileName} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#333' }} />
          )}
        </div>
      </div>
    </div>
  );
}
