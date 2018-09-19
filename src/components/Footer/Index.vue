<template>
    <div class="site-footer">
        <div class="FooterNavCollectionView">
            <div id="footer-nav" class="footer-nav aside">
                <div class="FooterNavView"><router-link to="/terms">Terms</router-link></div>
                <div class="FooterNavView"><router-link to="/privacy">Privacy</router-link></div>
                <div class="FooterNavView"><router-link to="/contact">Contact</router-link></div>
                <div class="FooterNavView"><router-link to="http://epoch.com">Billing support</router-link></div>
                <div class="FooterNavView settings-onmyteam-link"><router-link to="/">OnMyTeam.com</router-link></div>
            </div>
            <div id="second-footer-nav" class="footer-nav second-footer-nav">
                <div class="FooterNavView"><router-link to="/2257">18 U.S.C. 2257 Record-Keeping Requirements Compliance Statement</router-link></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Footer'
    }
</script>

<style scoped>
    .footer-nav {
        display: flex;
        font-size: 13px;
        padding: 23px 0 17px;
        justify-content: center;
    }
    
    @media (min-width: 992px) {
        .footer-nav {
            padding: 3px 0 15px;
        }
    }
    
    @media (max-width: 992px) {
        .footer-nav {
            justify-content: space-between;
        }
    }
    
    .footer-nav.second-footer-nav {
        padding-top: 0;
        text-align: center;
        justify-content: center;
    }
    
    @media (min-width: 992px) {
        .footer-nav {
            margin-right: auto;
        }
    }
    
    .footer-nav a {
        color: inherit;
        opacity: 0.3;
        transition: opacity 0.3s ease;
    }
    
    .footer-nav a:hover {
        opacity: 1;
    }
    
    .footer-nav.aside {
        flex-wrap: wrap;
    }
    
    .footer-nav .FooterNavView {
        margin: 0 14px;
    }
    
    @media (min-width: 992px) {
        .footer-nav .FooterNavView {
            margin-right: 8px;
            margin-left: 8px;
        }
    }
    
    @media (max-width: 992px) {
        .footer-nav .FooterNavView {
            margin: 0 14px;
        }
    }
    
    @media (max-width: 992px) {
        .footer-nav .FooterNavView.settings-onmyteam-link {
            margin: 10px auto;
            flex: 0 0 100%;
            text-align: center;
        }
    }
    
    .staticPage .footer-nav,
    .error404View .footer-nav {
        flex-wrap: wrap;
    }
    
    @media (max-width: 992px) {
        .staticPage .footer-nav,
        .error404View .footer-nav {
            padding: 0;
        }
    }
    
    @media (max-width: 992px) {
        .staticPage .footer-nav .FooterNavView,
        .error404View .footer-nav .FooterNavView {
            margin: 0;
        }
    }
    
    @media (max-width: 992px) {
        .staticPage .footer-nav .FooterNavView.settings-onmyteam-link,
        .error404View .footer-nav .FooterNavView.settings-onmyteam-link {
            margin: 10px auto;
            flex: 0 0 100%;
            text-align: center;
        }
    }
    
    @media (min-width: 992px) {
        .aside-col .footer-nav .FooterNavView.settings-onmyteam-link {
            margin: 10px auto 0;
        }
    }
    
    .aside-col_with-footer .site-footer {
        display: none;
    }
    
    @media (min-width: 992px) {
        .aside-col_with-footer .site-footer {
            margin-top: 73px;
            padding-top: 20px;
            position: sticky;
            display: block;
        }
    }
    
    .aside-col_with-footer .site-footer:before {
        content: '';
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        position: absolute;
        background: linear-gradient(to right, rgba(124, 139, 150, 0.2) 0%, transparent 100%);
        display: none;
    }
    
    @media (min-width: 992px) {
        .aside-col_with-footer .site-footer:before {
            display: block;
        }
    }
</style>