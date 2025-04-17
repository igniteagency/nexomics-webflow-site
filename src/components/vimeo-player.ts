import Player from '@vimeo/player';

// Define the PlayerState interface
interface PlayerState {
  playing: boolean;
  isInView: boolean;
  isHoverMode: boolean;
  hoverElement: HTMLElement | null;
  initialized: boolean;
}

class VimeoPlayerManager {
  private static instance: VimeoPlayerManager | null = null;

  // Data attribute selectors
  /**
   * Set attribute on the component
   */
  private readonly COMPONENT_SELECTOR = '[data-vimeo-el="component"]';
  /**
   * Set attribute on the player iframe element
   */
  private readonly PLAYER_SELECTOR = '[data-vimeo-el="player-iframe"]';
  /**
   * Set attribute on the play/pause button wrapper element
   */
  private readonly PLAY_PAUSE_BUTTON_SELECTOR = '[data-vimeo-el="toggle-button"]';
  /**
   * Set the play icon element
   */
  private readonly PLAY_ICON_SELECTOR = '[data-vimeo-el="play-icon"]';
  /**
   * Set the pause icon element
   */
  private readonly PAUSE_ICON_SELECTOR = '[data-vimeo-el="pause-icon"]';
  /**
   * Set the loop attribute on component to false to disable looping
   */
  private readonly LOOP_ATTR = 'data-vimeo-loop';
  /**
   * Set the hover attribute on either the container or a parent element to play video on hover
   */
  private readonly HOVER_ATTR = 'data-vimeo-hover';
  /**
   * Hide class for the play/pause button icon toggle
   */
  private readonly HIDE_CLASS = 'hide';

  private players: Map<HTMLElement, Player> = new Map();
  private playerStates: Map<HTMLElement, PlayerState> = new Map();
  private intersectionObserver: IntersectionObserver | null = null;
  private prefersReducedMotion: boolean;

  private constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initIntersectionObserver();
  }

  private initIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const container = entry.target as HTMLElement;
          let state = this.playerStates.get(container);

          if (!state) {
            // Handle initialization if needed
            if (entry.isIntersecting) {
              this.initializePlayer(container);
            }
          }
          state = this.playerStates.get(container);
          if (!state) return;

          state.isInView = entry.isIntersecting;

          // Handle play/pause based on visibility
          const player = this.players.get(container);
          if (!player) return;

          // Only auto-play/pause based on visibility if reduced motion is not preferred
          // and not in hover mode
          if (!this.prefersReducedMotion && !state.isHoverMode) {
            if (entry.isIntersecting && !state.playing) {
              // Coming into view while not playing
              this.playVideo(player, state);
              console.debug('In view, playing video', container);
            } else if (!entry.isIntersecting && state.playing) {
              // Going out of view while playing
              this.pauseVideo(player, state);
              console.debug('Out of view, pausing video', container);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
      }
    );
  }

  public static getInstance(): VimeoPlayerManager {
    if (!VimeoPlayerManager.instance) {
      VimeoPlayerManager.instance = new VimeoPlayerManager();
    }
    return VimeoPlayerManager.instance;
  }

  private updatePlayPauseUI(container: HTMLElement, isPlaying: boolean): void {
    const playIcon = container.querySelector(this.PLAY_ICON_SELECTOR) as HTMLElement;
    const pauseIcon = container.querySelector(this.PAUSE_ICON_SELECTOR) as HTMLElement;
    const toggleButton = container.querySelector(this.PLAY_PAUSE_BUTTON_SELECTOR) as HTMLElement;

    if (!playIcon || !pauseIcon || !toggleButton) return;

    if (isPlaying) {
      playIcon.classList.add(this.HIDE_CLASS);
      pauseIcon.classList.remove(this.HIDE_CLASS);
      toggleButton.setAttribute('aria-label', 'Pause video');
    } else {
      pauseIcon.classList.add(this.HIDE_CLASS);
      playIcon.classList.remove(this.HIDE_CLASS);
      toggleButton.setAttribute('aria-label', 'Play video');
    }
  }

  private playVideo(player: Player, state: PlayerState): Promise<void> {
    return player.play().catch((err) => console.error('Error playing video:', err));
  }

  private pauseVideo(player: Player, state: PlayerState): Promise<void> {
    return player.pause().catch((err) => console.error('Error pausing video:', err));
  }

  private togglePlayPause(player: Player, state: PlayerState): void {
    if (state.playing) {
      this.pauseVideo(player, state);
    } else {
      this.playVideo(player, state);
    }
  }

  private setupPlayerEvents(container: HTMLElement, player: Player, state: PlayerState): void {
    const playPauseButton = container.querySelector(this.PLAY_PAUSE_BUTTON_SELECTOR);

    // Check if looping should be disabled
    const disableLoop = container.getAttribute(this.LOOP_ATTR) === 'false';
    player.setLoop(!disableLoop);

    // Set up hover functionality if enabled
    if (state.isHoverMode && state.hoverElement) {
      state.hoverElement.addEventListener('mouseenter', () => {
        if (!state.playing) {
          this.playVideo(player, state);
        }
      });

      state.hoverElement.addEventListener('focusin', () => {
        if (!state.playing) {
          this.playVideo(player, state);
        }
      });

      state.hoverElement.addEventListener('mouseleave', () => {
        if (state.playing) {
          this.pauseVideo(player, state);
        }
      });

      state.hoverElement.addEventListener('focusout', () => {
        if (state.playing) {
          this.pauseVideo(player, state);
        }
      });
    }

    // Set up Vimeo event listeners for play/pause
    player.on('play', () => {
      state.playing = true;
      this.updatePlayPauseUI(container, true);
    });

    player.on('pause', () => {
      state.playing = false;
      this.updatePlayPauseUI(container, false);
    });

    // Add click event to the play/pause button
    if (playPauseButton) {
      // Set initial aria-label based on current state
      playPauseButton.setAttribute('aria-label', state.playing ? 'Pause video' : 'Play video');

      container.addEventListener('click', () => {
        player
          .getPaused()
          .then((isPaused) => {
            state.playing = !isPaused;
            this.togglePlayPause(player, state);
          })
          .catch(() => {
            state.playing = !state.playing;
            this.togglePlayPause(player, state);
          });
      });
    }
  }

  private initializePlayer(container: HTMLElement): void {
    const iframe = container.querySelector(this.PLAYER_SELECTOR) as HTMLIFrameElement;

    // Create player with autoplay disabled
    const player = new Player(iframe, {
      autoplay: false,
      loop: true,
      muted: true,
    });

    this.players.set(container, player);

    // Check if hover mode is enabled
    const hoverElement = container.getAttribute(this.HOVER_ATTR)
      ? container
      : container.closest<HTMLElement>(`[${this.HOVER_ATTR}]`) || null;
    const isHoverMode = hoverElement ? true : false;

    // Initialize player state
    const state: PlayerState = {
      playing: false,
      isInView: false,
      isHoverMode,
      hoverElement,
      initialized: true,
    };
    this.playerStates.set(container, state);

    // Basic initialization
    player
      .ready()
      .then(() => {
        this.updatePlayPauseUI(container, false);
      })
      .catch((error) => {
        console.error('Error initializing Vimeo player:', error);
        player.pause().catch(() => {});
        state.playing = false;
        this.updatePlayPauseUI(container, false);
      });

    // Set up player events
    this.setupPlayerEvents(container, player, state);
  }

  public initializeAllPlayers(): void {
    const containers = document.querySelectorAll(this.COMPONENT_SELECTOR);

    // Set up the intersection observer for all containers
    containers.forEach((container) => {
      // Observe the container for intersection
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(container);
      }
    });
  }
}

// Export a function to initialize all players
export function initializeVimeoPlayers(): void {
  VimeoPlayerManager.getInstance().initializeAllPlayers();
}
