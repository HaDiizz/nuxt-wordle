<script setup>
import { ref, reactive, watch, onMounted } from "vue";

useSeoMeta({
  titleTemplate: "%s - Leader Board",
  ogTitle: "%s - Leader Board",
});

const { data: session } = useAuth();

const itemsPerPage = ref(5);
const headers = ref([
  { title: "No.", key: "no", align: "center", sortable: true },
  { title: "Image", key: "image", align: "center", sortable: false },
  {
    title: "Username",
    align: "start",
    sortable: true,
    key: "username",
  },
  { title: "Scores", key: "scores", align: "end", sortable: true },
  { title: "Games Played", key: "gamesPlayed", align: "end", sortable: true },
  { title: "Games Won", key: "gamesWon", align: "end", sortable: true },
  { title: "Games Lost", key: "gamesLost", align: "end", sortable: true },
  {
    title: "Games Incomplete",
    key: "gamesIncomplete",
    align: "end",
    sortable: true,
  },
  { title: "Win Rate (%)", key: "winRate", align: "end", sortable: true },
]);

const state = reactive({
  serverItems: [],
  loading: true,
  totalItems: 0,
  search: "",
  username: "",
});

watch(
  () => [state.username],
  () => {
    state.search = String(Date.now());
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
  }
);

const fetchData = async ({ page, itemsPerPage, sortBy }) => {
  const data = await $fetch("/api/game/ranking", {
    method: "GET",
  });
  if (data.error) {
    return;
  }

  let items = (await data?.result) || [];

  items = items.map((item, index) => ({
    ...item,
    winRate: item.gamesPlayed
      ? ((item.gamesWon / item.gamesPlayed) * 100).toFixed(2)
      : "0.00",
    image: `https://api.dicebear.com/8.x/thumbs/svg?scale=85&shapeColor=5D00FF&backgroundColor=D7C0FF&seed=${item.username}`,
    no: index + 1,
    gamesIncomplete: item.gamesPlayed - item.gamesWon - item.gamesLost,
  }));

  items = items.filter((item) => {
    if (
      state.username &&
      !item.username.toLowerCase().includes(state.username.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (sortBy.length) {
    const sortKey = sortBy[0].key;
    const sortOrder = sortBy[0].order;
    items.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });
  }
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  state.serverItems = items.slice(start, end);
  state.totalItems = items.length;
  state.loading = false;
};

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  state.loading = true;
  await fetchData({ page, itemsPerPage, sortBy });
};

onMounted(() => {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
});
</script>

<template>
  <v-app>
    <div class="bg-ground-default h-screen p-3">
      <h1 class="dark:text-white pb-8 text-4xl uppercase font-bold">
        Leader Board
      </h1>
      <div
        v-if="session?.user"
        class="overflow-x-auto px-10 mb-10 rounded-md border-2 border-indigo-500 shadow-[0px_0px_20px_3px_#6610FB]"
      >
        <table class="table dark:text-white">
          <thead>
            <tr>
              <th>No.</th>
              <th>Image</th>
              <th>Username</th>
              <th>Scores</th>
              <th>Games Played</th>
              <th>Games Won</th>
              <th>Games Lost</th>
              <th>Games Incomplete</th>
              <th>Games Win Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                {{
                  state.serverItems.findIndex(
                    (item) => item._id === session.user._id
                  ) + 1
                }}
              </th>
              <td>
                <div class="avatar p-2">
                  <div class="mask mask-squircle w-12 h-12">
                    <img
                      :src="`https://api.dicebear.com/8.x/thumbs/svg?scale=85&shapeColor=5D00FF&backgroundColor=D7C0FF&seed=${session.user.username}`"
                      alt="User Image"
                    />
                  </div>
                </div>
              </td>
              <td>{{ session.user.username }}</td>
              <td>{{ session.user.scores }}</td>
              <td>{{ session.user.gamesPlayed }}</td>
              <td>{{ session.user.gamesWon }}</td>
              <td>{{ session.user.gamesLost }}</td>
              <td>
                {{
                  session.user.gamesPlayed -
                  session.user.gamesWon -
                  session.user.gamesLost
                }}
              </td>
              <td>
                {{
                  session.user.gamesPlayed
                    ? (
                        (session.user.gamesWon / session.user.gamesPlayed) *
                        100
                      ).toFixed(2)
                    : "0.00"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <v-data-table
          class="ranking-table rounded-md"
          :headers="headers"
          :items="state.serverItems"
          :items-per-page="itemsPerPage"
          :loading="state.loading"
          :server-items-length="state.totalItems"
          @update:page="
            (page) =>
              loadItems({ page, itemsPerPage: itemsPerPage, sortBy: [] })
          "
          @update:items-per-page="
            (itemsPerPage) => loadItems({ page: 1, itemsPerPage, sortBy: [] })
          "
          @update:sort-by="
            (sortBy) =>
              loadItems({ page: 1, itemsPerPage: itemsPerPage, sortBy })
          "
        >
          <template #item.image="{ item }">
            <div class="avatar p-2">
              <div class="mask mask-squircle w-12 h-12">
                <img :src="item.image" alt="User Image" />
              </div>
            </div>
          </template>
          <template #top>
            <v-text-field
              v-model="state.username"
              label="Search by username"
              class="mx-4"
            ></v-text-field>
          </template>
        </v-data-table>
      </div>
    </div>
  </v-app>
</template>
