import { Style as StyleDefinition } from ".";
import { Color } from "../../../color";
import { Font, FontStyle, FontWeight } from "../font";
import { Background } from "../background";
import { Length, PercentLength, ViewBase, BackgroundRepeat, Visibility,
    HorizontalAlignment, VerticalAlignment, dip, LinearGradient } from "../../core/view";
import { Observable } from "../../../data/observable";

import {
    FlexDirection, FlexWrap, JustifyContent, AlignItems, AlignContent,
    Order, FlexGrow, FlexShrink, FlexWrapBefore, AlignSelf
} from "../../layouts/flexbox-layout";
import {
    write as traceWrite,
    categories as traceCategories,
    messageType as traceMessageType,
} from "../../../trace";
import { TextAlignment, TextDecoration, TextTransform, WhiteSpace } from "../../text-base";

function makeCssVariableName(varName: string, scoped: boolean) {
    if (scoped) {
        return `scoped:${varName}`;
    }

    return varName;
}

export class Style extends Observable implements StyleDefinition {
    private cssVariables = new Map<string, string>();

    constructor(ownerView: ViewBase | WeakRef<ViewBase>) {
        super();

        // HACK: Could not find better way for cross platform WeakRef type checking.
        if (ownerView.constructor.toString().indexOf("[native code]") !== -1) {
            this.viewRef = <WeakRef<ViewBase>>ownerView;
        } else  {
            this.viewRef = new WeakRef(<ViewBase>ownerView);
        }
    }

    public setCssVariable(varName: string, value: string, scoped: boolean): void {
        this.cssVariables.set(makeCssVariableName(varName, scoped), value);
    }

    public unsetCssVariable(varName: string, scoped: boolean): void {
        this.cssVariables.delete(makeCssVariableName(varName, scoped));
    }

    public getCssVariable(varName: string): string | null {
        const view = this.view;
        if (!view) {
            return null;
        }

        if (this.cssVariables.has(varName)) {
            return this.cssVariables.get(varName);
        }

        const localVarName = makeCssVariableName(varName, true);
        if (this.cssVariables.has(localVarName)) {
            return this.cssVariables.get(localVarName);
        }

        if (!view.parent || !view.parent.style) {
            return null;
        }

        return view.parent.style.getCssVariable(varName);
    }

    public clearCssVariable(scoped?: boolean): void {
        if (typeof scoped === "undefined") {
            this.cssVariables.clear();

            return;
        }

        for (const varName of Array.from(this.cssVariables.keys())) {
            if (varName.startsWith("scoped:") === scoped) {
                this.cssVariables.delete(varName);
            }
        }
    }

    toString() {
        const view = this.viewRef.get();
        if (!view) {
            traceWrite(`toString() of Style cannot execute correctly because ".viewRef" is cleared`, traceCategories.Animation, traceMessageType.warn);

            return "";
        }

        return `${view}.style`;
    }

    public fontInternal: Font;
    public backgroundInternal: Background;

    public rotate: number;
    public scaleX: number;
    public scaleY: number;
    public translateX: dip;
    public translateY: dip;

    public clipPath: string;
    public color: Color;
    public tintColor: Color;
    public placeholderColor: Color;

    public background: string;
    public backgroundColor: Color;
    public backgroundImage: string | LinearGradient;
    public backgroundRepeat: BackgroundRepeat;
    public backgroundSize: string;
    public backgroundPosition: string;

    public borderColor: string | Color;
    public borderTopColor: Color;
    public borderRightColor: Color;
    public borderBottomColor: Color;
    public borderLeftColor: Color;
    public borderWidth: string | Length;
    public borderTopWidth: Length;
    public borderRightWidth: Length;
    public borderBottomWidth: Length;
    public borderLeftWidth: Length;
    public borderRadius: string | Length;
    public borderTopLeftRadius: Length;
    public borderTopRightRadius: Length;
    public borderBottomRightRadius: Length;
    public borderBottomLeftRadius: Length;

    public fontSize: number;
    public fontFamily: string;
    public fontStyle: FontStyle;
    public fontWeight: FontWeight;
    public font: string;

    public androidElevation: number;
    public androidDynamicElevationOffset: number;
    public zIndex: number;
    public opacity: number;
    public visibility: Visibility;

    public letterSpacing: number;
    public lineHeight: number;
    public textAlignment: TextAlignment;
    public textDecoration: TextDecoration;
    public textTransform: TextTransform;
    public whiteSpace: WhiteSpace;

    public minWidth: Length;
    public minHeight: Length;
    public width: PercentLength;
    public height: PercentLength;
    public margin: string | PercentLength;
    public marginLeft: PercentLength;
    public marginTop: PercentLength;
    public marginRight: PercentLength;
    public marginBottom: PercentLength;
    public padding: string | Length;
    public paddingLeft: Length;
    public paddingTop: Length;
    public paddingRight: Length;
    public paddingBottom: Length;
    public horizontalAlignment: HorizontalAlignment;
    public verticalAlignment: VerticalAlignment;

    // TabView-specific props
    public tabTextFontSize: number;
    public tabTextColor: Color;
    public tabBackgroundColor: Color;
    public selectedTabTextColor: Color;
    public androidSelectedTabHighlightColor: Color;

    // ListView-specific props
    public separatorColor: Color;

    //SegmentedBar-specific props
    public selectedBackgroundColor: Color;

    // Page-specific props
    public statusBarStyle: "light" | "dark";
    public androidStatusBarBackground: Color;

    //flexbox layout properties
    public flexDirection: FlexDirection;
    public flexWrap: FlexWrap;
    public justifyContent: JustifyContent;
    public alignItems: AlignItems;
    public alignContent: AlignContent;
    public order: Order;
    public flexGrow: FlexGrow;
    public flexShrink: FlexShrink;
    public flexWrapBefore: FlexWrapBefore;
    public alignSelf: AlignSelf;

    public PropertyBag: { new(): { [property: string]: string }, prototype: { [property: string]: string } };

    public viewRef: WeakRef<ViewBase>;

    public get view(): ViewBase {
        if (this.viewRef) {
            return this.viewRef.get();
        }

        return undefined;
    }
}
Style.prototype.PropertyBag = class { [property: string]: string; };
