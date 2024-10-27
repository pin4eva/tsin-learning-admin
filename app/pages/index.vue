<template>
  <div class="container mx-auto">
    <UCard class="mb-5" v-for="session in sessions" :key="session.name">
      <template #header>

        <h4>{{ session.name }}</h4>
      </template>

    <UTable :rows="session.tracks" :columns="columns">
    <template #trackName-data="{row}">
    {{ row.trackName.toUpperCase() }}
    </template>
     <template #groupName-data="{row}">
      <tr v-for="group in row.groups" :key="group.name">
        <td>{{ group.groupName }}</td>
      </tr>
    </template>
    <template #members-data="{row}" >
      <tr v-for="group in row.groups" :key="group.name">
        <td>
          <span class="mx-1" v-for="member in group.members" :key="member.userName">{{ member.userName }},</span>
        </td>
      </tr>
    </template>

    <template #leaders-data="{row}" >
      <tr v-for="leader in row.leaders" :key="leader.userName">
        <td>
          <span class="mx-1" v-for="member in leader.members" :key="member.userName"> <b>{{member.case  }}:</b> {{ member.userName }},</span>
        </td>
      </tr>
    </template>

    </UTable>

    </UCard>
  </div>
</template>


<script lang="ts" setup>
import type { ISchedule, ISessionTrack, ITrack, IGroup, } from "../interfaces/schedule.interface";
import _ from "lodash";

// const sessions = ref<ISessionTrack[]>([]);
const config = useRuntimeConfig();

const columns = [{key:"trackName",label:"Tracks"},{key:"groupName",label:"Groups"},{key:"members",label:"Members"},{key:"leaders",label:"Leaders"}]
const {data: sessions} =  useAsyncData("test",async () => {
  try {
    const data = await $fetch<{ name: string; schedules: ISchedule[] }>(config.public.API_URL+"/schedules/weekly/learning/66e18a0d7e3a8b0f07c7d2af", {
      headers: {
        Authorization: "Bearer "+ config.public.JWT_TOKEN
      }
    });

    const sessionValue = data.schedules.map((schedule) => schedule.session);

    const sessionTracks: ISessionTrack[] = []
    for (const session of sessionValue) {
      const sessionTrack: ISessionTrack = {
        name: session.name,
        tracks: []
      }

      const trackGroups = _.groupBy(session.sessionUsers, "track");
      const trackLeadersGroups = _.groupBy(session.leaders, "track");

      for (const trackGroup of Object.keys(trackGroups)) {
        const track: ITrack = {
          trackName: trackGroup,
          leaders: [],
          groups: []
        }

        const groupLeaderItems = _.groupBy(trackLeadersGroups[trackGroup], (data) => data.group);
        Object.keys(groupLeaderItems).forEach((group) => {
          const leaders: IGroup = {
            groupName: group,
            members: []
          };
          groupLeaderItems[group]?.forEach((member) => {
            leaders.members.push({
              case: member.case?.description,
              userName: member?.userName
            })
          })
          track.leaders.push(leaders);
        })

        const groupItems = _.groupBy(trackGroups[trackGroup], (data) => data.group);

        for (const groupItem of Object.keys(groupItems)) {
          const group: IGroup = {
            groupName: groupItem,
            members: groupItems[groupItem]?.map((u) => ({ userName: u.userName })) || []
          }

          track.groups.push(group)
        }

        sessionTrack.tracks.push(track)
      }


      sessionTracks.push(sessionTrack);


console.log(sessionTrack);

    }

    sessions.value = sessionTracks;

    return sessionTracks;
  } catch (error) {
    console.log(error);
    return []

  }
})





</script>
