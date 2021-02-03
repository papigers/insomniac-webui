export interface Entity extends Record<string, any> {
  id: string;
}

export type RangeString = `${number}-${number}`;
export type NumberString = `${number}`;
export type NumberOrRangeParameter = RangeString | NumberString | number;

export enum ActionType {
  INTERACT = 'interact',
  UNFOLLOW = 'unfollow',
  SCRAPE = 'scrape',
  REMOVE_MASS_FOLLOWERS = 'remove mass followers',
}

export type Device = {
  id: string;
  name: string;
  androidDeviceId: string;
  old: boolean;
};

export type InstagramProfile = {
  id: string;
  username: string;
  deviceId: string;
  appId: string;
  deviceName?: string;
};

export enum InteractionSourceType {
  SOURCES = 'sources',
  TARGETS = 'targets',
}

export enum InstagramSourceType {
  PLACE = 'place',
  HASHTAG = 'hashtag',
  PROFILE = 'profile',
}

export enum InstagramSourceSubType {
  TOP_LIKERS = 'top likers',
  RECENT_LIKERS = 'recent likers',
  FOLLOWERS = 'followers',
  FOLLOWINGS = 'followings',
}

export type InstagramSource = {
  type: InstagramSourceType;
  name: string;
  subType: InstagramSourceSubType;
} & (
  | {
      type: InstagramSourceType.PLACE | InstagramSourceType.HASHTAG;
      subType: InstagramSourceSubType.RECENT_LIKERS | InstagramSourceSubType.TOP_LIKERS;
    }
  | {
      type: InstagramSourceType.PROFILE;
      subType: InstagramSourceSubType.FOLLOWINGS | InstagramSourceSubType.FOLLOWERS;
    }
);

export enum UnfollowSourceType {
  FOLLOWERS = 'followers list',
  DATABASE = 'database',
}

export enum FollowersSortOrder {
  DEFAULT = 'default',
  EARLIEST = 'earlieset',
  LATEST = 'latest',
}

interface InteractConfig {
  interact_by?: InteractionSourceType;
  interact?: InstagramSource[];
  interact_targets?: string[];
  likes_count?: NumberOrRangeParameter;
  likes_percentage?: NumberOrRangeParameter;
  stories_count?: NumberOrRangeParameter;
  follow_percentage?: NumberOrRangeParameter;
  comment_percentage?: NumberOrRangeParameter;
  comments_list?: string[];
  reinteract_after?: NumberOrRangeParameter;
}

interface UnfollowConfig {
  // unfollow
  unfollow_by?: UnfollowSourceType;
  following_sort_order?: FollowersSortOrder;
  unfollow?: NumberOrRangeParameter;
  unfollow_followed_by_anyone?: boolean;
  unfollow_non_followers?: boolean;
  recheck_follow_status_after?: NumberOrRangeParameter;
}

interface ScrapeConfig {
  // scrape
  scrape?: InstagramSource[];
  scrape_for_account?: string[];
  scrapping_main_db_directory_name?: string;
}

interface RemoveMassConfig {
  // remove mass followers
  remove_mass_followers?: NumberOrRangeParameter;
  mass_follower_min_following?: NumberOrRangeParameter;
}

export type BotConfig = {
  // general
  id: string;
  name: string;
  instagramProfileId: string;
  instagramProfileName?: string;
  deviceId?: string;
  deviceName?: string;
  working_hours?: NumberOrRangeParameter;

  // action
  actionType: ActionType;

  // limits
  min_following?: number;
  max_following?: number;
  total_likes_limit?: number;
  total_story_limit?: number;
  total_comments_limit?: number;
  total_get_profile_limit?: number;
  total_interactions_limit?: number;
  total_successful_interactions_limit?: number;
  total_follow_limit?: number;
  follow_limit_per_source?: number;
  interactions_limit_per_source?: number;
  successful_interactions_limit_per_source?: number;
  session_length_in_mins_limit?: number;
  total_scrape_limit?: number;
  scrape_limit_per_source?: number;

  // filters
  filters: {
    skip_business?: boolean;
    skip_non_business?: boolean;
    min_followers?: number;
    max_followers?: number;
    min_followings?: number;
    max_followings?: number;
    min_potency_ratio?: number;
    max_potency_ratio?: number;
    min_posts?: number;
    max_digits_in_profile_name?: number;
    privacy_relation?: 'private' | 'public' | 'private_and_public';
    skip_profiles_without_stories?: boolean;
    blacklist_words?: string[];
    mandatory_words?: string[];
    specific_alphabet?: string[];
    skip_already_following_profiles?: boolean;
  };

  // advanced
  dont_indicate_softban?: boolean;
  wait_for_device?: boolean;
  debug?: boolean;
  no_speed_check?: boolean;
  pre_session_script?: string;
  post_session_script?: string;
} & Partial<InteractConfig> &
  Partial<UnfollowConfig> &
  Partial<ScrapeConfig> &
  Partial<RemoveMassConfig> &
  (
    | {
        actionType: ActionType.INTERACT;
        interact_by: InteractionSourceType;
        interact: InstagramSource[];
      }
    | {
        actionType: ActionType.INTERACT;
        interact_by: InteractionSourceType;
        interact_targets: string[];
      }
    | {
        actionType: ActionType.UNFOLLOW;
        unfollow: NumberOrRangeParameter;
        unfollow_by: UnfollowSourceType;
      }
    | {
        acttionType: ActionType.SCRAPE;
        scrape: InstagramSource[];
      }
    | {
        acttionType: ActionType.REMOVE_MASS_FOLLOWERS;
        remove_mass_followers: NumberOrRangeParameter;
      }
  );

export type FlowConfigStep = {
  configId: string;
  configName?: string;
  repeat: number;
};

export type Flow = {
  id: string;
  name: string;
  deviceId: string;
  deviceName?: string;
  configs: FlowConfigStep[];
};
