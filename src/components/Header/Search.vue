<template>
    <form class="header-search" method="get" action="/search/users">
        <input class="header-search-input rounded sm" name="q" maxlength="13" autocomplete="off" value="" placeholder="Search" type="text" />
        <span role="button" tabindex="-1" id="header-search-clear"></span>
        <button type="submit" class="header-search-submit"></button>
        <button type="button" class="btn-clear-search hidden"></button>
        <div class="header-search-results">
            <div class="SearchResultsPopupCollectionView hidden">
                <div class="users"></div>
                <div class="search-all-link">
                    <a href="/search/users/" class="searchAllLink">
                    Search all for&nbsp;
                    <span class="searchAllTag"></span>
                    </a>
                </div>
                <button type="button" class="close"></button>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        name: 'Search'
    }
</script>
