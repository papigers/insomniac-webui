import { FormEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { useApiContext } from 'ApiContext';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TextInput from 'components/TextInput/TextInput';
import {
  ActionType,
  BotConfig,
  FollowersSortOrder,
  InstagramSource,
  InstagramSourceSubType,
  InstagramSourceType,
  InteractionSourceType,
  UnfollowSourceType,
} from 'types';
import Select from 'components/Select/Select';
import * as yup from 'yup';
import { uid } from 'uid';
import Parameter, { ParameterType } from 'components/Parameter/Parameter';
import _capitalize from 'lodash/capitalize';
import InputTable from 'components/InputTable/InputTable';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import Checkbox from 'components/Checkbox/Checkbox';
import Slider from 'components/Slider/Slider';

const yupRange = () =>
  yup
    .string()
    // eslint-disable-next-line no-template-curly-in-string
    .matches(/^(\d+)(-\d+){0,1}$/, '${path} must be a number (e.g. 100) or a range (e.g. 100-200)');

const schema = yup.object({
  name: yup.string().required().label('Name'),
  instagramProfileId: yup.string().required().label('Instagram Profile'),
  working_hours: yupRange().notRequired().nullable().label('Working Hours'),
  actionType: yup.string().oneOf(Object.values(ActionType)).required().label('Action'),
  interact_by: yup
    .string()
    .oneOf(Object.values(InteractionSourceType))
    .when('actionType', (actionType: ActionType, schema: yup.StringSchema) =>
      actionType === ActionType.INTERACT ? schema.required() : schema,
    )
    .label('Interact By'),
  interact: yup
    .array()
    .of(
      yup.object({
        type: yup.string().oneOf(Object.values(InstagramSourceType)).required().label('Type'),
        name: yup.string().required().label('Name'),
        subType: yup
          .string()
          .oneOf(Object.values(InstagramSourceSubType))
          .required()
          .label('Source'),
      }),
    )
    .when(['actionType', 'interact_by'], ((
      actionType: ActionType,
      interactBy: InteractionSourceType,
      schema: yup.ArraySchema<yup.AnySchema>,
    ) =>
      actionType === ActionType.INTERACT && interactBy === InteractionSourceType.SOURCES
        ? schema.required().min(1)
        : schema) as any)
    .label('Interact Sources'),
  interact_targets: yup
    .array()
    .of(yup.string().label('Taget').required())
    .when(['actionType', 'interact_by'], ((
      actionType: ActionType,
      interactBy: InteractionSourceType,
      schema: yup.ArraySchema<yup.AnySchema>,
    ) =>
      actionType === ActionType.INTERACT && interactBy === InteractionSourceType.TARGETS
        ? schema.required().min(1)
        : schema) as any)
    .label('Interact Targets'),
  likes_count: yupRange().notRequired().nullable().label('Likes Count'),
  likes_percentage: yupRange().notRequired().nullable().label('Likes Percentage'),
  stories_count: yupRange().notRequired().nullable().label('Stories Count'),
  follow_percentage: yupRange().notRequired().nullable().label('Follows Percentage'),
  comment_percentage: yupRange().notRequired().nullable().label('Comments Percentage'),
  comments_list: yup.array().of(yup.string().label('Comment').required()).label('Comments'),
  reinteract_after: yupRange().notRequired().nullable().label('Reinteract After'),
  unfollow_by: yup
    .string()
    .oneOf(Object.values(UnfollowSourceType))
    .when('actionType', (actionType: ActionType, schema: yup.StringSchema) =>
      actionType === ActionType.UNFOLLOW ? schema.required() : schema,
    )
    .label('Unfollow By'),
  following_sort_order: yup
    .string()
    .oneOf(Object.values(FollowersSortOrder))
    .when(['actionType', 'unfollow_by'], ((
      actionType: ActionType,
      unfollowBy: UnfollowSourceType,
      schema: yup.StringSchema,
    ) => {
      return (actionType === ActionType.UNFOLLOW && unfollowBy === UnfollowSourceType.FOLLOWERS
        ? schema.required()
        : schema) as typeof schema;
    }) as any)
    .label('Following Sort Order'),
  unfollow: yupRange()
    .when('actionType', (actionType: ActionType, schema: yup.StringSchema) =>
      actionType === ActionType.UNFOLLOW ? schema.required() : schema,
    )
    .label('Unfollow Amount'),
  unfollow_followed_by_anyone: yup.boolean().label('Unfollow Followed By Anyone'),
  unfollow_non_followers: yup.boolean().label('Unfollow Non Followers'),
  recheck_follow_status_after: yupRange().label('Recheck Follow Status Order'),
  scrape: yup
    .array()
    .of(
      yup.object({
        type: yup.string().oneOf(Object.values(InstagramSourceType)).required().label('Type'),
        name: yup.string().required().label('Name'),
        subType: yup
          .string()
          .oneOf(Object.values(InstagramSourceSubType))
          .required()
          .label('Source'),
      }),
    )
    .when('actionType', (actionType: ActionType, schema: yup.ArraySchema<yup.AnySchema>) =>
      actionType === ActionType.SCRAPE ? schema.required().min(1) : schema,
    )
    .label('Scrape Sources'),
  scrape_for_account: yup
    .array()
    .of(yup.string().label('Comment').required())
    .label('Scrape Accounts'),
  scrapping_main_db_directory_name: yup.string().label('Scrape Group'),
  remove_mass_followers: yupRange()
    .when('actionType', (actionType: ActionType, schema: yup.StringSchema) =>
      actionType === ActionType.REMOVE_MASS_FOLLOWERS ? schema.required() : schema,
    )
    .label('Remove Mass Followers Amount'),
  mass_follower_min_following: yupRange().label('Remove Mass Followers Min Following'),

  min_following: yup.number().min(0).integer().label('Min Following Limit'),
  max_following: yup.number().min(0).integer().label('Max Following Limit'),
  total_likes_limit: yupRange().label('Total Likes Limit'),
  total_story_limit: yupRange().label('Total Story Limit'),
  total_comments_limit: yupRange().label('Total Comments Limit'),
  total_get_profile_limit: yupRange().label('Total Profile View Limit'),
  total_interactions_limit: yupRange().label('Total Interactions Limit'),
  total_successful_interactions_limit: yupRange().label('Total Interactions Limit'),
  total_follow_limit: yupRange().label('Total Follow Limit'),
  follow_limit_per_source: yupRange().label('Follow Limit Per Source'),
  interactions_limit_per_source: yupRange().label('Interactions Limit Per Source'),
  successful_interactions_limit_per_source: yupRange().label(
    'Succesful Interactions Limit Per Source',
  ),
  total_scrape_limit: yupRange().label('Total Scrape Limit'),
  scrape_limit_per_source: yupRange().label('Scrape Limit Per Source'),
  filters: yup
    .object({
      skip_business: yup.bool().label('Skip Businees Filter'),
      skip_non_business: yup.bool().label('Skip Non-Businees Filter'),
      min_followers: yup.number().integer().label('Min Followers Filter'),
      max_followers: yup.number().integer().label('Max Followers Filter'),
      min_followings: yup.number().integer().label('Min Followings Filter'),
      max_followings: yup.number().integer().label('Max Followings Filter'),
      min_posts: yup.number().integer().label('Min Posts'),
      max_digits_in_profile_name: yup.number().integer().label('Max Digits in Profile Name Filter'),
      min_potency_ratio: yup.number().min(0).max(1).label('Min Potency Ratio Filter'),
      max_potency_ratio: yup.number().min(0).max(1).label('Max Potency Ratio Filter'),
      privacy_relation: yup
        .string()
        .oneOf(['private', 'public', 'private_and_public'])
        .label('Privacy Relation Filter'),
      skip_profiles_without_stories: yup.bool().label('Skip Profiles Without Stories Filter'),
      skip_already_following_profiles: yup.bool().label('Skip Already Following Profiles Filter'),
      blacklist_words: yup.array().of(yup.string().required()).label('Blacklist Workds'),
      mandatory_words: yup.array().of(yup.string().required()).label('Blacklist Workds'),
      specific_alphabet: yup.array().of(yup.string().required()).label('Specific Alphabet'),
    })
    .default({}),

  dont_indicate_softban: yup.bool().label("Don't Indicate Softban"),
  wait_for_device: yup.bool().label('Wait For Device'),
  debug: yup.bool().label('Debug'),
  no_speed_check: yup.bool().label('No Speed Check'),
  pre_session_script: yup.string().label('Pre Session Script'),
  post_session_script: yup.string().label('Post Seession Script'),
});

const tabs = ['General', 'Action', 'Limits', 'Filter', 'Advanced'];

export default function EditBotConfig(): ReactElement {
  const { botConfigs, instagramProfiles, addEntity, editEntity } = useApiContext();
  const match = useRouteMatch<{ id: string }>('/bot-configs/:id');
  const id = match?.params?.id;
  const config = (id && id !== 'new' ? botConfigs.find((cfg) => cfg.id === id) : null) || {
    instagramProfileId: instagramProfiles?.[0]?.id,
    actionType: ActionType.INTERACT,
    interact_by: InteractionSourceType.SOURCES,
    unfollow_by: UnfollowSourceType.FOLLOWERS,
    following_sort_order: FollowersSortOrder.EARLIEST,
    filters: {},
  };
  const [state, setState] = useState<Partial<BotConfig>>(config);
  const isNew = !('id' in state);
  const history = useHistory();
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    setState((state) => ({
      ...state,
      instagramProfileId: state.instagramProfileId || instagramProfiles?.[0]?.id,
    }));
  }, [instagramProfiles]);

  useEffect(() => {
    schema
      .validate(state)
      .then(() => setIsValid(true))
      .catch((err) => {
        setIsValid(false);
        console.log(err);
        if (state[err.path as keyof BotConfig] !== undefined) {
          setErrors(err.errors);
        }
      });
  }, [state]);

  const setAttribute = useCallback((event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setState((state) => ({
      ...state,
      [event.target.name]: value,
    }));
  }, []);

  const setParameter = useCallback((name: string, value: any) => {
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  }, []);

  const setFilter = useCallback((name: string, value: any) => {
    setState((state) => ({
      ...state,
      filters: {
        ...state.filters,
        [name]: value,
      },
    }));
  }, []);

  const onSave = useCallback(
    (e?: FormEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      try {
        schema.validate(state);
        if (isNew) {
          addEntity('botConfigs', {
            ...state,
            id: uid(),
          });
        } else {
          const config = state as BotConfig;
          editEntity('botConfigs', config.id, config);
        }
        history.goBack();
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          setErrors(err.errors);
          setIsValid(false);
        }
      }
    },
    [addEntity, editEntity, history, isNew, state],
  );

  const renderActionInputs = useCallback(() => {
    switch (state.actionType) {
      case ActionType.INTERACT:
        return (
          <>
            <div className="pb-4">
              <RadioGroup
                name="interact_by"
                options={Object.values(InteractionSourceType).map((value) => ({
                  value,
                  label: _capitalize(value),
                }))}
                value={state.interact_by}
                onChange={setAttribute}
                label="Interact By:"
                className="py-6"
              />
              {state.interact_by === InteractionSourceType.SOURCES ? (
                <InputTable
                  onChange={(val) => {
                    setParameter('interact', val);
                  }}
                  inputs={[
                    {
                      key: 'type',
                      type: 'select',
                      name: 'Type',
                      default: InstagramSourceType.PROFILE,
                      props: () => ({
                        options: Object.values(InstagramSourceType).map((value) => ({
                          value,
                          label: _capitalize(value),
                        })),
                      }),
                    },
                    {
                      key: 'name',
                      type: 'string',
                      name: 'Name',
                    },
                    {
                      key: 'subType',
                      type: 'select',
                      name: 'Source',
                      default: InstagramSourceSubType.FOLLOWERS,
                      props: (item: InstagramSource) => ({
                        options: (item.type === InstagramSourceType.PROFILE
                          ? [InstagramSourceSubType.FOLLOWERS, InstagramSourceSubType.FOLLOWINGS]
                          : [
                              InstagramSourceSubType.TOP_LIKERS,
                              InstagramSourceSubType.RECENT_LIKERS,
                            ]
                        ).map((value) => ({
                          value,
                          label: _capitalize(value),
                        })),
                      }),
                    },
                  ]}
                  value={state.interact || []}
                  name="Interaction Sources"
                />
              ) : (
                <>
                  <InputTable
                    onChange={(val) =>
                      setParameter(
                        'interact_targets',
                        val.map(({ target }) => target),
                      )
                    }
                    inputs={[
                      {
                        key: 'target',
                        type: 'string',
                        name: 'Profile Name',
                      },
                    ]}
                    value={(state.interact_targets || []).map((target) => ({
                      target,
                    }))}
                    name="Targets"
                  />
                  <Checkbox
                    label="Include Scraped Targets"
                    checked
                    onChange={() => null}
                    disabled
                    className="pt-4"
                  />
                </>
              )}
            </div>
            <Parameter
              type={ParameterType.RANGE}
              name="likes_count"
              label="Likes Count"
              value={state.likes_count}
              onChange={setParameter}
              className="py-4"
              minValue={0}
              maxValue={20}
            />
            <Parameter
              type={ParameterType.RANGE}
              name="likes_percentage"
              label="Likes Percentage"
              value={state.likes_percentage}
              onChange={setParameter}
              className="py-4"
              minValue={0}
              maxValue={100}
              formatLabel={(value) => `${value}%`}
            />
            <Parameter
              type={ParameterType.RANGE}
              name="stories_count"
              label="Stories Count"
              value={state.stories_count}
              onChange={setParameter}
              className="py-4"
              minValue={0}
              maxValue={20}
            />
            <Parameter
              type={ParameterType.RANGE}
              name="follow_percentage"
              label="Follow Percentage"
              value={state.follow_percentage}
              onChange={setParameter}
              className="py-4"
              minValue={0}
              maxValue={100}
              formatLabel={(value) => `${value}%`}
            />
            <Parameter
              type={ParameterType.RANGE}
              name="comment_percentage"
              label="Comment Percentage"
              value={state.comment_percentage}
              onChange={setParameter}
              className="py-4"
              minValue={0}
              maxValue={100}
              formatLabel={(value) => `${value}%`}
            />
            <Parameter
              type={ParameterType.CUSTOM}
              name="comments_list"
              label="Comments"
              value={state.comments_list}
              onChange={setParameter}
              className="py-4"
            >
              {(value: string[], onChange, disabled) => (
                <InputTable
                  disabled={disabled}
                  onChange={(val) => {
                    onChange(val.map(({ comment }: { comment: string }) => comment));
                  }}
                  inputs={[
                    {
                      key: 'comment',
                      type: 'string',
                      name: 'Comment',
                    },
                  ]}
                  value={(value || []).map((comment) => ({
                    comment: comment,
                  }))}
                  name="Comments"
                />
              )}
            </Parameter>
            <Parameter
              type={ParameterType.RANGE}
              name="reinteract_after"
              label="Reinteract After"
              value={state.reinteract_after}
              onChange={setParameter}
              className="py-4"
              minValue={1}
              maxValue={24 * 4}
              formatLabel={(value) => `${value}h`}
            />
          </>
        );
      case ActionType.UNFOLLOW:
        return (
          <>
            <div>
              <RadioGroup
                name="unfollow_by"
                options={Object.values(UnfollowSourceType).map((value) => ({
                  value,
                  label: _capitalize(value),
                  disabled: value === UnfollowSourceType.DATABASE,
                }))}
                value={state.unfollow_by}
                onChange={setAttribute}
                label="Unfollow By:"
                className="py-6"
              />
              {state.unfollow_by === UnfollowSourceType.FOLLOWERS ? (
                <Select
                  label="Sort Followers"
                  name="following_sort_order"
                  options={Object.values(FollowersSortOrder).map((value) => ({
                    value,
                    label: _capitalize(value),
                  }))}
                  value={state.following_sort_order}
                  className="pt-2 pb-4"
                />
              ) : null}
            </div>
            <Parameter
              type={ParameterType.RANGE}
              name="unfollow"
              label="Unfollow Count"
              value={state.unfollow}
              onChange={setParameter}
              className="py-4"
              minValue={0}
              maxValue={1000}
            />
            <Parameter
              type={ParameterType.CHECKBOX}
              name="unfollow_followed_by_anyone"
              label="Followed By Anyone"
              value={state.unfollow_followed_by_anyone}
              onChange={setParameter}
            />
            <Parameter
              type={ParameterType.CHECKBOX}
              name="unfollow_non_followers"
              label="Only Non-Followers"
              value={state.unfollow_non_followers}
              onChange={setParameter}
            />
            <Parameter
              type={ParameterType.RANGE}
              name="recheck_follow_status_after"
              label="Recheck Follow Status After"
              value={state.recheck_follow_status_after}
              onChange={setParameter}
              className="py-4"
              minValue={0}
              maxValue={24 * 4}
              formatLabel={(val) => `${val}h`}
            />
          </>
        );
      case ActionType.SCRAPE:
        return (
          <>
            <InputTable
              onChange={(val) => {
                setParameter('scrape', val);
              }}
              inputs={[
                {
                  key: 'type',
                  type: 'select',
                  name: 'Type',
                  default: InstagramSourceType.PROFILE,
                  props: () => ({
                    options: Object.values(InstagramSourceType).map((value) => ({
                      value,
                      label: _capitalize(value),
                    })),
                  }),
                },
                {
                  key: 'name',
                  type: 'string',
                  name: 'Name',
                },
                {
                  key: 'subType',
                  type: 'select',
                  name: 'Source',
                  default: InstagramSourceSubType.FOLLOWERS,
                  props: (item: InstagramSource) => ({
                    options: (item.type === InstagramSourceType.PROFILE
                      ? [InstagramSourceSubType.FOLLOWERS, InstagramSourceSubType.FOLLOWINGS]
                      : [InstagramSourceSubType.TOP_LIKERS, InstagramSourceSubType.RECENT_LIKERS]
                    ).map((value) => ({
                      value,
                      label: _capitalize(value),
                    })),
                  }),
                },
              ]}
              value={state.scrape || []}
              name="Interaction Sources"
            />
            <Parameter
              type={ParameterType.CUSTOM}
              name="scrape_for_account"
              label="Only For:"
              value={state.scrape_for_account}
              onChange={setParameter}
              className="py-4"
            >
              {(value: string[], onChange, disabled) => (
                <InputTable
                  disabled={disabled}
                  onChange={(val) => {
                    onChange(val.map(({ profile }: { profile: string }) => profile));
                  }}
                  inputs={[
                    {
                      key: 'profile',
                      type: 'string',
                      name: 'Profile Name',
                    },
                  ]}
                  value={(value || []).map((profile) => ({
                    profile,
                  }))}
                  name="Profiles"
                />
              )}
            </Parameter>
            <Parameter
              type={ParameterType.TEXT}
              name="scrapping_main_db_directory_name"
              value={state.scrapping_main_db_directory_name}
              label="Scrapers Group"
            />
          </>
        );
      case ActionType.REMOVE_MASS_FOLLOWERS:
        return (
          <>
            <Slider
              name="remove_mass_followers"
              onChange={setAttribute}
              label="Amount"
              className="py-6"
              required
              minValue={1}
              maxValue={1000}
            />
            <Parameter
              type={ParameterType.RANGE}
              name="mass_follower_min_following"
              label="Minimum Following of Removed Follower"
              value={state.mass_follower_min_following}
              onChange={setParameter}
              className="py-4"
              minValue={0}
              maxValue={5000}
            />
          </>
        );
      default:
        return null;
    }
  }, [
    setAttribute,
    setParameter,
    state.actionType,
    state.comment_percentage,
    state.comments_list,
    state.follow_percentage,
    state.following_sort_order,
    state.interact,
    state.interact_by,
    state.interact_targets,
    state.likes_count,
    state.likes_percentage,
    state.mass_follower_min_following,
    state.recheck_follow_status_after,
    state.reinteract_after,
    state.scrape,
    state.scrape_for_account,
    state.scrapping_main_db_directory_name,
    state.stories_count,
    state.unfollow,
    state.unfollow_by,
    state.unfollow_followed_by_anyone,
    state.unfollow_non_followers,
  ]);

  const renderTabInputs = useCallback(() => {
    switch (activeTab) {
      case 'General':
        return (
          <>
            <TextInput
              required
              label="Name"
              value={state.name || ''}
              onChange={setAttribute}
              name="name"
              className="py-4"
            />
            <Select
              required
              label="Instagram Profile"
              value={state.instagramProfileId || ''}
              onChange={setAttribute}
              name="instagramProfileId"
              options={instagramProfiles.map((profile) => ({
                value: profile.id,
                label: `${profile.username} (${profile.appId})`,
              }))}
              className="py-4"
            />
            <Parameter
              type={ParameterType.RANGE}
              name="working_hours"
              label="Working Hours"
              value={state.working_hours}
              onChange={setParameter}
              className="py-4"
              minValue={0}
              maxValue={23}
            />
          </>
        );
      case 'Action':
        return (
          <>
            <Select
              name="actionType"
              label="Action"
              value={state.actionType}
              options={Object.values(ActionType).map((action) => ({
                value: action,
                label: _capitalize(action),
              }))}
              required
              onChange={setAttribute}
              className="py-4"
            />
            {renderActionInputs()}
          </>
        );
      case 'Limits':
        return (
          <>
            {state.actionType === ActionType.UNFOLLOW && (
              <Parameter
                type={ParameterType.NUMBER}
                name="min_following"
                label="Min Following"
                value={state.min_following}
                min={0}
              />
            )}
            {state.actionType === ActionType.INTERACT && (
              <>
                <Parameter
                  type={ParameterType.NUMBER}
                  name="max_following"
                  label="Max Following"
                  value={state.max_following}
                  min={0}
                />
                <Parameter
                  type={ParameterType.RANGE}
                  name="total_likes_limit"
                  label="Total Likes"
                  value={state.total_likes_limit}
                  minValue={1}
                  maxValue={1000}
                />
                <Parameter
                  type={ParameterType.RANGE}
                  name="total_comments_limit"
                  label="Total Comments"
                  value={state.total_comments_limit}
                  minValue={1}
                  maxValue={1000}
                />
                <Parameter
                  type={ParameterType.RANGE}
                  name="total_story_limit"
                  label="Total Stories"
                  value={state.total_story_limit}
                  minValue={1}
                  maxValue={1000}
                />
                <Parameter
                  type={ParameterType.RANGE}
                  name="total_interactions_limit"
                  label="Total Interactions"
                  value={state.total_interactions_limit}
                  minValue={1}
                  maxValue={1000}
                />
                <Parameter
                  type={ParameterType.RANGE}
                  name="total_successful_interactions_limit"
                  label="Total Successful Interactions"
                  value={state.total_successful_interactions_limit}
                  minValue={1}
                  maxValue={1000}
                />
                <Parameter
                  type={ParameterType.RANGE}
                  name="total_follow_limit"
                  label="Total Follows"
                  value={state.total_follow_limit}
                  minValue={1}
                  maxValue={1000}
                />
                <Parameter
                  type={ParameterType.RANGE}
                  name="follow_limit_per_source"
                  label="Follows Per Source"
                  value={state.follow_limit_per_source}
                  minValue={1}
                  maxValue={1000}
                />
                <Parameter
                  type={ParameterType.RANGE}
                  name="interactions_limit_per_source"
                  label="Interactions Per Source"
                  value={state.interactions_limit_per_source}
                  minValue={1}
                  maxValue={1000}
                />
                <Parameter
                  type={ParameterType.RANGE}
                  name="successful_interactions_limit_per_source"
                  label="Successful Interactions Per Source"
                  value={state.successful_interactions_limit_per_source}
                  minValue={1}
                  maxValue={1000}
                />
              </>
            )}
            <Parameter
              type={ParameterType.RANGE}
              name="total_get_profile_limit"
              label="Total Profile Views"
              value={state.total_get_profile_limit}
              minValue={1}
              maxValue={1000}
            />
            <Parameter
              type={ParameterType.RANGE}
              name="session_length_in_mins_limit"
              label="Session Length"
              value={state.session_length_in_mins_limit}
              minValue={1}
              maxValue={1000}
              formatLabel={(val) => `${val}min`}
            />
            {state.actionType === ActionType.SCRAPE && (
              <>
                <Parameter
                  type={ParameterType.RANGE}
                  name="total_scrape_limit"
                  label="Scrapes"
                  value={state.total_scrape_limit}
                  minValue={1}
                  maxValue={1000}
                />
                <Parameter
                  type={ParameterType.RANGE}
                  name="scrape_limit_per_source"
                  label="Scrapes Per Source"
                  value={state.scrape_limit_per_source}
                  minValue={1}
                  maxValue={1000}
                />
              </>
            )}
          </>
        );
      case 'Filter':
        return (
          <>
            <Parameter
              type={ParameterType.CHECKBOX}
              name="skip_business"
              value={state.filters?.skip_business}
              onChange={setFilter}
              label="Skip Business"
            />
            <Parameter
              type={ParameterType.CHECKBOX}
              name="skip_non_business"
              value={state.filters?.skip_non_business}
              onChange={setFilter}
              label="Skip Non Business"
            />
            <Parameter
              type={ParameterType.NUMBER}
              name="min_followers"
              label="Min Followers"
              value={state.filters?.min_followers}
              min={0}
            />
            <Parameter
              type={ParameterType.NUMBER}
              name="max_followers"
              label="Max Followers"
              value={state.filters?.max_followers}
              min={0}
            />
            <Parameter
              type={ParameterType.NUMBER}
              name="min_followings"
              label="Min Followings"
              value={state.filters?.min_followings}
              min={0}
            />
            <Parameter
              type={ParameterType.NUMBER}
              name="max_followings"
              label="Max Followings"
              value={state.filters?.max_followings}
              min={0}
            />
            <Parameter
              type={ParameterType.NUMBER}
              name="min_potency_ratio"
              label="Min Potency Ratio"
              value={state.filters?.min_potency_ratio}
              min={0}
              max={1}
              step={0.01}
            />
            <Parameter
              type={ParameterType.NUMBER}
              name="max_potency_ratio"
              label="Max Potency Ratio"
              value={state.filters?.max_potency_ratio}
              min={0}
              max={1}
              step={0.01}
            />
            <Parameter
              type={ParameterType.NUMBER}
              name="min_posts"
              label="Min Posts"
              value={state.filters?.min_posts}
              min={0}
            />
            <Parameter
              type={ParameterType.NUMBER}
              name="max_digits_in_profile_name"
              label="Max Digits In Profile Name"
              value={state.filters?.max_digits_in_profile_name}
              min={0}
            />
            <Parameter
              type={ParameterType.CUSTOM}
              name="privacy_relation"
              label="Privacy Relation"
              value={state.filters?.privacy_relation}
              inline
            >
              {(value, onChange) => (
                <Select
                  options={[
                    {
                      value: 'private_and_public',
                      label: 'Private & Public',
                    },
                    {
                      value: 'privat',
                      label: 'Private',
                    },
                    {
                      value: 'public',
                      label: 'Public',
                    },
                  ]}
                  value={value}
                  onChange={onChange}
                />
              )}
            </Parameter>
            <Parameter
              type={ParameterType.CHECKBOX}
              name="skip_profiles_without_stories"
              value={state.filters?.skip_profiles_without_stories}
              onChange={setFilter}
              label="Skip Profiles Without Stories"
            />
            <Parameter
              type={ParameterType.CUSTOM}
              name="blacklist_words"
              label="Blacklist Words"
              value={state.filters?.blacklist_words}
              onChange={setFilter}
              className="py-4"
            >
              {(value: string[], onChange, disabled) => (
                <InputTable
                  disabled={disabled}
                  onChange={(val) => {
                    onChange(val.map(({ word }: { word: string }) => word));
                  }}
                  inputs={[
                    {
                      key: 'word',
                      type: 'string',
                      name: 'Word',
                    },
                  ]}
                  value={(value || []).map((word) => ({
                    word,
                  }))}
                  name="Blacklist Words"
                />
              )}
            </Parameter>
            <Parameter
              type={ParameterType.CUSTOM}
              name="mandatory_words"
              label="Mandatory Words"
              value={state.filters?.mandatory_words}
              onChange={setFilter}
              className="py-4"
            >
              {(value: string[], onChange, disabled) => (
                <InputTable
                  disabled={disabled}
                  onChange={(val) => {
                    onChange(val.map(({ word }: { word: string }) => word));
                  }}
                  inputs={[
                    {
                      key: 'word',
                      type: 'string',
                      name: 'Word',
                    },
                  ]}
                  value={(value || []).map((word) => ({
                    word,
                  }))}
                  name="Mandatory Words"
                />
              )}
            </Parameter>
            <Parameter
              type={ParameterType.CUSTOM}
              name="specific_alphabet"
              label="Specific Alphabets"
              value={state.filters?.specific_alphabet}
              onChange={setFilter}
              className="py-4"
            >
              {(value: string[], onChange, disabled) => (
                <InputTable
                  disabled={disabled}
                  onChange={(val) => {
                    onChange(val.map(({ alphabet }: { alphabet: string }) => alphabet));
                  }}
                  inputs={[
                    {
                      key: 'alphabet',
                      type: 'string',
                      name: 'Alphabet',
                      props: () => ({
                        placeholder: '(e.g. latin, hebrew, arabic, etc...)',
                      }),
                    },
                  ]}
                  value={(value || []).map((alphabet) => ({
                    alphabet,
                  }))}
                  name="Specific Alphabets"
                />
              )}
            </Parameter>
            <Parameter
              type={ParameterType.CHECKBOX}
              name="skip_already_following_profiles"
              value={state.filters?.skip_already_following_profiles}
              onChange={setFilter}
              label="Skip Already Following Profiles"
            />
          </>
        );
      case 'Advanced':
        return (
          <>
            <Parameter
              type={ParameterType.CHECKBOX}
              name="dont_indicate_softban"
              value={state.dont_indicate_softban}
              onChange={setParameter}
              label="Don't Indicate Softban"
            />
            <Parameter
              type={ParameterType.CHECKBOX}
              name="wait_for_device"
              value={state.wait_for_device}
              onChange={setParameter}
              label="Wait For Device"
            />
            <Parameter
              type={ParameterType.CHECKBOX}
              name="debug"
              value={state.debug}
              onChange={setParameter}
              label="Debug"
            />
            <Parameter
              type={ParameterType.CHECKBOX}
              name="no_speed_check"
              value={state.no_speed_check}
              onChange={setParameter}
              label="No Speed Check"
            />
            <Parameter
              type={ParameterType.TEXT}
              name="pre_session_script"
              value={state.pre_session_script}
              onChange={setParameter}
              label="Pre Session Script"
              placeholder="File path"
            />
            <Parameter
              type={ParameterType.TEXT}
              name="post_session_script"
              value={state.post_session_script}
              onChange={setParameter}
              label="Post Session Script"
              placeholder="File path"
            />
          </>
        );
      default:
        return null;
    }
  }, [
    activeTab,
    instagramProfiles,
    renderActionInputs,
    setAttribute,
    setFilter,
    setParameter,
    state.actionType,
    state.debug,
    state.dont_indicate_softban,
    state.filters?.blacklist_words,
    state.filters?.mandatory_words,
    state.filters?.max_digits_in_profile_name,
    state.filters?.max_followers,
    state.filters?.max_followings,
    state.filters?.max_potency_ratio,
    state.filters?.min_followers,
    state.filters?.min_followings,
    state.filters?.min_posts,
    state.filters?.min_potency_ratio,
    state.filters?.privacy_relation,
    state.filters?.skip_already_following_profiles,
    state.filters?.skip_business,
    state.filters?.skip_non_business,
    state.filters?.skip_profiles_without_stories,
    state.filters?.specific_alphabet,
    state.follow_limit_per_source,
    state.instagramProfileId,
    state.interactions_limit_per_source,
    state.max_following,
    state.min_following,
    state.name,
    state.no_speed_check,
    state.post_session_script,
    state.pre_session_script,
    state.scrape_limit_per_source,
    state.session_length_in_mins_limit,
    state.successful_interactions_limit_per_source,
    state.total_comments_limit,
    state.total_follow_limit,
    state.total_get_profile_limit,
    state.total_interactions_limit,
    state.total_likes_limit,
    state.total_scrape_limit,
    state.total_story_limit,
    state.total_successful_interactions_limit,
    state.wait_for_device,
    state.working_hours,
  ]);

  return (
    <div className="relative flex flex-col flex-1 -ml-tabl -mr-tabr overflow-hidden">
      <div className="flex bg-white pb-4 mb-4 border-b pl-tabl pr-tabr items-center">
        <div>
          <button onClick={history.goBack} className="py-1 px-2 -ml-12 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              className="-mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-2xl flex-1">Bot Configs - {isNew ? 'Add' : 'Edit'} Bot Config</h1>
        <div>
          <button
            className="rounded-md border-green-600 border bg-green-500 text-white px-3 py-1 my-2 shadow-sm focus-within:border-green-600 focus:ring focus-within:ring-green-600 focus-within:ring-opacity-50 focus:outline-none disabled:pointer-events-none disabled:opacity-70 flex items-center"
            disabled={!isValid}
            onClick={onSave}
          >
            Save
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="20"
              height="20"
              fill="currentColor"
              className="inline ml-3"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex border-b border-gray-200 mb-4 -mt-4 -ml-6 bg-white pr-tabr pl-tabl">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 border-gray-400 hover:bg-gray-100 outline-none ring-0 focus:ring-0 focus:outline-none border-0 ${
              tab === activeTab ? 'border-b-2 ' : ''
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <form
        className="-mt-2 flex-1 overflow-y-auto pl-tabl pr-tabr pb-10 divide-y-2 divide-gray-100"
        onSubmit={onSave}
      >
        {errors.length ? (
          <ul className="list-disc list-inside">
            {errors.map((err) => (
              <li className="text-red-500">{err}</li>
            ))}
          </ul>
        ) : null}
        {renderTabInputs()}
      </form>
    </div>
  );
}
